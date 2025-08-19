const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Rotas de autenticação
//router.get('/abrirMenu', menuController.abrirMenu);
router.post('/abrirMenu', menuController.abrirMenu);
router.post('/inicio', menuController.inicio);
router.post('/logout', menuController.logout);

module.exports = router;
