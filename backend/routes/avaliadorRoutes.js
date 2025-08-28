const express = require('express');
const router = express.Router();
const avaliadorController = require('../controllers/avaliadorController');

// CRUD de Avaliadors


router.get('/', avaliadorController.listarAvaliador);
router.post('/', avaliadorController.criarAvaliador);
router.get('/:id', avaliadorController.obterAvaliador);
// não tem atualizar avaliador
router.delete('/:id', avaliadorController.deletarAvaliador);

module.exports = router;
