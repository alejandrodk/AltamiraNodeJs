var express = require('express');
var router = express.Router();
const controller = require('../controllers/admin');
const auth = require('../middlewares/auth').admin;

router.get('/panel', auth, controller.panel);

router.get('/clientes', auth, controller.clientes);
router.post('/clientes', auth, controller.clientes);
router.get('/clientes/comprobantes', auth, controller.comprobantes);
router.post('/clientes/comprobantes', auth, controller.comprobantes);
router.get('/clientes/registro', auth, controller.registro)
router.post('/clientes/registro', auth, controller.setRegistro);
router.get('/clientes/seguimientos', auth, controller.seguimiento);
router.post('/clientes/seguimientos', auth, controller.seguimiento);

router.get('/viajantes', auth, controller.viajantes);
router.post('/viajantes', auth, controller.viajantes);
router.get('/viajantes/cobranzas', auth, controller.cobranzas);
router.post('/viajantes/cobranzas', auth, controller.cobranzas);

router.get('/pedidos', auth, controller.pedidos);

router.get('/revistas/nueva', auth, controller.revista);
router.post('/revistas/nueva', auth, controller.revista);

router.get('/prueba', auth, controller.prueba);

module.exports = router;
