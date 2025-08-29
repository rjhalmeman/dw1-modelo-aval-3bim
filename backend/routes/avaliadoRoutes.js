const express = require('express');
const router = express.Router();
const avaliadoController = require('../controllers/avaliadoController');

// CRUD de Avaliados


router.get('/', avaliadoController.listarAvaliado);
router.post('/', avaliadoController.criarAvaliado);
router.get('/:id', avaliadoController.obterAvaliado);
// não tem atualizar avaliado
router.delete('/:id', avaliadoController.deletarAvaliado);

module.exports = router;
