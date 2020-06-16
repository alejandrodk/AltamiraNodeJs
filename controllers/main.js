const db = require('../database/models');
const redirect = require('../helpers/redirect');
const mailHelp = require('../helpers/mailHelp');

function getTitle(req){
	if(req.session.user){
		return 'Panel de cliente'
	} else {
		return 'iniciar sesión'
	}
}

const controller = {
	inicio: (req, res) => {
		let title_login = req.session.user == 'invitado' || req.session.user == undefined ? 
			'iniciar sesión' 
			: 
			'Panel de cliente'
			;
		res.render("main/index", { title_login : title_login });
	},
	login: (req, res) => {
		let error = '';
		if(req.query.error == 'invalidUser'){
			error = 'Debes ingresar a tu cuenta'
		}
		res.render("main/login", { error });
  	},
  	validarLogin: async (req,res) => {

		try {
			let user = await db.usuarios.findOne({ 
				where : { usuario : req.body.usuario },
				logging: false
			})

			if(user){
				if(user.clave == req.body.clave){
					delete user.clave;
					req.session.user = user;
					res.locals.user = user;
					res.cookie('user', user, {maxAge: 1000 * 60 * 60 * 24 * 7});
					return redirect(req,res);

				} else {
					res.render("main/login", { error : 'Usuario o clave inválido' });
				}
			} else {
				res.render("main/login", { error : 'El usuario no existe'});
			}
		}
		catch(err){
			console.error(err)
		}
  	},
  	nosotros: (req, res) => {
		let title_login = getTitle(req);
		res.render("main/nosotros", { title_login});
  	},
  	precios: (req, res) => {
		let title_login = getTitle(req);
		res.render("main/precios", { title_login});
  	},
  	destacados: (req, res) => {
		let title_login = getTitle(req);
		res.render("main/destacados", { title_login});
  	},
  	cliente: (req, res) => {
		let title_login = getTitle(req);
  	    res.render("main/cliente", {title_login});
  	},
  	contacto: (req, res) => {
		let title_login = getTitle(req);
		res.render("main/contacto", { title_login});
	},
  	logout : (req, res) => {
		req.session.destroy();
		res.locals.user = {};
		delete res.locals;
		delete res.session;
		res.cookie('user', null, { maxAge: -1 });
		return res.redirect('/');
	},
	formulario : (req, res) => {
		let type = req.query.type;

		if(type == 'contacto'){
			mailHelp.contacto(req,res)
		}
		
		if(type == 'cliente'){
			mailHelp.cliente(req,res)
		}
	}
};

module.exports = controller;