const express = require('express');
const router = express.Router();
const avaliacaoHasQuestaoController = require('./../controllers/avaliacaoHasQuestaoController');

// CRUD de Avaliacaos

router.get('/abrirCrudAvaliacaoHasQuestao', avaliacaoHasQuestaoController.abrirCrudAvaliacaoHasQuestao);
// router.get('/', avaliacaoHasQuestaoController.listarAvaliacaoHasQuestao);
//  router.post('/', avaliacaoHasQuestaoController.criarAvaliacao);
router.get('/:id', avaliacaoHasQuestaoController.obterAvaliacaoHasQuestaoList);
//  router.put('/:id', avaliacaoHasQuestaoController.atualizarAvaliacao);
//  router.delete('/:id', avaliacaoHasQuestaoController.deletarAvaliacao);

module.exports = router;
