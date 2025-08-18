const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Rotas de autenticação
router.post('/abrirMenu', menuController.abrirMenu);
router.post('/inicio', menuController.inicio);




module.exports = router;
