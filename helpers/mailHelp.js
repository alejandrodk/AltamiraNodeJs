const nodemailer = require('nodemailer');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

module.exports = {
	contacto : (req,res) => {
		let { nombre, empresa, localidad, telefono, correo, mensaje } = req.body;

		let transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail'
		});

		let compiled = ejs.compile(fs.readFileSync(path.join(__dirname, '../views/email/contacto.ejs'), 'utf8'));
		let html = compiled({ nombre, empresa, localidad, telefono, correo, mensaje });

		transporter.sendMail({
			from: '"Altamira Group" info@webapp.altamiragroup.com.ar',
			replyTo: 'info@altamiragroup.com.ar',
			to: 'info@altamiragroup.com.ar',
			bcc: 'publicidad@altamiragroup.com.ar',
			subject: 'Contacto vía web',
			html: html

		}, (err, info) => {
			if(err){
				console.log(err)
			}
			/* console.log(info.envelope);
			console.log(info.messageId); */
			res.redirect('/')
		});
	},
	cliente : (req,res) => {
		let { nombre, empresa, cuit, localidad, direccion, telefono, mensaje } = req.body;
		let transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail'
		});
		transporter.sendMail({
			from: '"Altamira Group" info@webapp.altamiragroup.com.ar',
			replyTo: 'info@altamiragroup.com.ar',
			to: 'info@altamiragroup.com.ar',
			subject: 'Solicitud de visita',
			html: `
			<h1> Solicitud de visita de viajante </h1>
			<p>Nombre: ${nombre}</p> \n
			<p>Empresa: ${empresa}</p> \n
			<p>Cuit: ${cuit}</p> \n
			<p>Localidad: ${localidad}</p> \n
			<p>Direccion: ${direccion}</p> \n
			<p>Telefono: ${telefono}</p> \n
			<p>Mensaje: ${mensaje}</p> \n
			`
		}, (err, info) => {
			if(err){
				console.log(err)
			}
			/* console.log(info.envelope);
			console.log(info.messageId); */
			res.redirect('/cliente')
		});
	},
	pagos : (req,res) => {
		if(req.body.lenght == 0){
			return res.send('sin datos en el formulario')
		}
		let { factura, monto, banco, fecha, mensaje } = req.body;
		let archivo = req.file ? req.file : { buffer : '', encoding : ''};
		
		let transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail'
		});
		transporter.sendMail({
			from: '"Altamira Group" info@webapp.altamiragroup.com.ar',
			replyTo: 'info@altamiragroup.com.ar',
			to: 'info@altamiragroup.com.ar',
			subject: 'Aviso de pago',
			attachments : [{ 
				filename : archivo.originalname ,
				content : new Buffer(archivo.buffer, archivo.encoding)

			}],
			html: `
			<h1> Aviso de pago </h1>
			<p>Cliente: ${ req.session.user.numero }</p> \n
			<p>Factura: ${factura}</p> \n
			<p>Monto: ${monto}</p> \n
			<p>Banco: ${banco}</p> \n
			<p>Fecha: ${fecha}</p> \n
			<p>Mensaje: ${mensaje}</p> \n
			`
		}, (err, info) => {
			if(err){
				console.log(err)
			}
			/* console.log(info.envelope);
			console.log(info.messageId); */
			res.redirect('/clientes/perfil')
		});
	},
	registro : (usuario, clave, email) => {

		let transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail'
		});

		let compiled = ejs.compile(fs.readFileSync(path.join(__dirname, '../views/email/registro.ejs'), 'utf8'));
		let html = compiled({ usuario, clave });

		transporter.sendMail({
			from: '"Altamira Group" info@webapp.altamiragroup.com.ar',
			replyTo: 'info@altamiragroup.com.ar',
			to: email,
			bcc: 'publicidad@altamiragroup.com.ar',
			subject: '¡Bienvenido! - Altamira Group',
			html: html

		}, (err, info) => {
			if(err){
				console.log(err)
			}

			return { info : info.envelope, message : info.messageId }
			//console.log(info.envelope);
			//console.log(info.messageId);
		});
	}
}