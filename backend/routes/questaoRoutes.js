const express = require('express');
const router = express.Router();
const questaoController = require('./../controllers/questaoController');

// CRUD de Questaos

router.get('/abrirCrudQuestao', questaoController.abrirCrudQuestao);
router.get('/', questaoController.listarQuestoes);
router.post('/', questaoController.criarQuestao);
router.get('/:id', questaoController.obterQuestao);
router.put('/:id', questaoController.atualizarQuestao);
router.delete('/:id', questaoController.deletarQuestao);

module.exports = router;
