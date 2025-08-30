const express = require('express');
const router = express.Router();
const avaliacaoController = require('./../controllers/avaliacaoController');

// CRUD de Avaliacaos

router.get('/abrirCrudAvaliacao', avaliacaoController.abrirCrudAvaliacao);
router.get('/', avaliacaoController.listarAvaliacoes);
router.post('/', avaliacaoController.criarAvaliacao);
router.get('/:id', avaliacaoController.obterAvaliacao);
router.put('/:id', avaliacaoController.atualizarAvaliacao);
router.delete('/:id', avaliacaoController.deletarAvaliacao);

module.exports = router;
