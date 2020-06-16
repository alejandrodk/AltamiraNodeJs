const db = require("../database/models");
const mailHelp = require('../helpers/mailHelp');

const controller = {
    perfil : async (req, res) => {
        let user = req.session.user;

        try {
            let usuario = await db.usuarios.findOne({ 
                where : { id : user.id},
                attributes : ['usuario'],
                logging: false 
            });
            let cliente = await db.clientes.findOne({ 
                where : { numero : user.numero},
                include : [{ 
                    model: db.viajantes, 
                    as : 'viajante' , 
                    attributes : ['numero','nombre','telefono','email']
                }],
                logging: false 
            });
            let saldo = await db.saldos.findOne({
                where : { cuenta : user.numero }, 
                logging: false
            })

            return res.render('clientes/perfil', { 
                usuario: usuario.usuario,
                cliente,
                saldo
            })
        }
        catch(err){
            console.error(err)
        }

    },
    comprobantes : async (req, res) => {
        let user = req.session.user;

        try {
            let cliente = await db.clientes.findOne({ 
                where : { numero : user.numero}, 
                logging: false 
            });
            let comprobantes = await db.comprobantes.findAll({ 
                where : { cliente_num : user.numero }, 
                logging: false 
            });
            return res.render('clientes/comprobantes', { 
                cliente,
                comprobantes,
                usuario: user.usuario
            })
        }
        catch(err){
            console.error(err)
        }
    },
    detalle : (req, res) =>  {

        let cliente = req.session.user.numero
        let numero = req.params.numeroComp;
        let tipo = req.query.tipo;

        res.render('clientes/comprobanteDetalle',{
            cliente,
            numero,
            tipo
        });
    },
    pagos : async (req, res) => {
        let user = req.session.user;
        
        try {
            let cliente = await db.clientes.findOne({ 
                where : { numero : user.numero}, 
                logging: false 
            });
            let comprobantes = await db.comprobantes.findAll({ 
                where : { cliente_num : user.numero }, 
                logging: false 
            });

            let facturas = [];
            comprobantes.forEach(comp => {
                let tipoFact = comp.tipo.split(' ');
                if(tipoFact[0] == 'Factura'){
                    facturas.push(comp.numero)
                }
            })

            return res.render('clientes/pagos', { 
                cliente,
                comprobantes: facturas 
            })
        }
        catch(err){
            console.error(err)
        }
    },
    send : (req, res) => {
        mailHelp.pagos(req, res)
    },
    pedidos : async (req, res) => {
        let user = req.session.user;

        try {
            let seguimientos = await db.seguimientos.findAll({
                where : { cuenta : user.numero}, 
                logging: false 
            });
            let pedidos = await db.pedidos.findAll({ 
                where : { cliente_id : user.numero}, 
                include : [{
                    model: db.articulos,
                    as: 'articulos',
                    attributes : ['codigo']
                }],
                logging: false
            });

            return res.render('clientes/pedidos', {
                pedidos,
                seguimientos
            })
        }
        catch(err){
            console.error(err)
        }
        
    }
}

module.exports = controller;