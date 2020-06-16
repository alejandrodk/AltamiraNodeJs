const db = require("../database/models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const queries = require('../helpers/adminQuery');
const mssqlconfig = require('../database/config/mssqlConfig');
const sql = require("mssql");
const mailer = require('../helpers/mailHelp');

module.exports = {
    panel : async (req, res) =>{
        try {
            let pedidos = await db.pedidos.findAll({
                attributes : ['id','cliente_id','fecha'],
                include : [{ model: db.clientes, as: 'cliente', attributes: ['razon_social']}],
                order : [['fecha','DESC']],
                limit : 10,
                logging: false
            });
            return res.render('admin/panel', {
                pedidos
            });
        }
        catch(err){
            console.error(err)
        }
    },
    clientes : async (req, res) => {
        let query = req.body.busqueda;
        let where = {};

        if(query){
            where = {
                [Op.and]: [{ 
                    [Op.or] : [
                        { numero : {[Op.like]: '%' + query + '%' }},
                        { direccion : {[Op.like]: '%' + query + '%' }},
                        { razon_social : {[Op.like]: '%' + query + '%' }}
                    ]
                }]
            }
        }

        try {
            let clientes = await db.clientes.findAll({
                where,
                limit : 50, 
			    logging: false,
                include : [{
                    model: db.usuarios, 
                    as: 'usuario', 
                    attributes : ['usuario','clave']
                }]
            })

            return res.render('admin/clientes',{ clientes })
        }
        catch(err){
            console.error(err)
        }
    },
    comprobantes : async (req, res) => {
        let query = req.body.busqueda;
        let where = {}

        if(query){
            where = {
                [Op.and]: [{
                    [Op.or]: [
                        { numero: { [Op.like]: "%" + query + "%" } },
                        { razon_social: { [Op.like]: "%" + query + "%" } }
                    ]
                }]
            }
        }

        try {
            let data = await db.clientes.findAll({
                where,
                limit : 50,
                logging : false,
                attributes : ['numero','razon_social'],
                include : [
                    { model: db.saldos, as: "saldo", attributes: ['saldo'], required: true},
                    { model: db.comprobantes, as : 'comprobantes' }
                ],
                order : ['razon_social', [ db.comprobantes, 'fecha', 'ASC']]
            });

            res.render('admin/comprobantes',{ data })
        }
        catch(err){
            console.error(err)
        }
    },
    registro : (req, res) => {
        res.render('admin/registro')
    },
    prueba : async (req, res) => {
        try {
            // pasar usuario, clave y mail de destino
            let prueba = await mailer.registro(req);
            return res.send(prueba)
        }
        catch(e){
            console.error(e)
        }
    },
    setRegistro : async (req, res) => {
        const { usuario, clave, tipo, numero } = req.body;

        let pool = await sql.connect(mssqlconfig);

        try {
            let user = await db.usuarios.create({ usuario, clave, tipo, numero });
            let insert = await pool.request()
                .input('usuario', usuario)
                .input('clave', clave)
                .input('numero',`00${numero}`)
                .query(`
                    UPDATE VTMCLH 
                    SET USR_VTMCLH_USERS=@usuario, 
                    USR_VTMCLH_USRPASS=@clave
                    WHERE VTMCLH_NROCTA=@numero 
                `)
            if(insert.rowsAffected.length < 3) return res.send('Usuario creado, falló al guardar en sofland')
            
            let user_data = await db.clientes.findAll({ where : { numero }, attributes : ['correo']})
            let send_mail = await mailer.registro(usuario, clave, user_data.correo);


            return res.send('Usuario creado')

            sql.on('error', err => {
                throw 'MSSQL Error'
            }) 
        }
        catch(err){
            console.error({
                message: 'error en registro',
                err
            })
        }
        finally {
            pool.close()
        }
    },
    seguimiento : async (req, res) => {
        let query = req.body.busqueda;
        let where = {};

        if(query){
            where = {
        		[Op.and]: [{
        		    [Op.or]: [
        		        { numero: { [Op.like]: "%" + query + "%" } },
        		        { direccion: { [Op.like]: "%" + query + "%" } },
        		        { razon_social: { [Op.like]: "%" + query + "%" } }
        		    ]
        		}]
        	}
        }

        try {
            let data = await db.clientes.findAll({
    		    where,
    		    attributes: ['numero',"razon_social"],
    		    include: [{
    		        model: db.seguimientos,
    		        as: "seguimientos",
    		        attributes: { exclude: ["cuenta"] },
    		        required: true
    		    }],
    		    order: ["razon_social"],
			    logging: false
    	    });

            res.render('admin/seguimientos',{ data })
        }
        catch(err){
            console.error(err)
        }
    }
}