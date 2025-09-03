const express = require('express');
const router = express.Router();
const avaliacaoController = require('./../controllers/avaliacaoController');

// CRUD de Avaliacaos

// router.get('/abrirCrudAvaliacaoHasQuestao', avaliacaoController.abrirCrudAvaliacaoHasQuestao);
// router.get('/', avaliacaoController.listarAvaliacaoHasQuestao);
// router.post('/', avaliacaoController.criarAvaliacao);
router.get('/:id', avaliacaoController.obterAvaliacaoHasQuestaoList);
// router.put('/:id', avaliacaoController.atualizarAvaliacao);
// router.delete('/:id', avaliacaoController.deletarAvaliacao);

module.exports = router;
