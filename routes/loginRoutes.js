const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// CRUD de Pessoas
//router.get('/', loginController.testeRota);
router.get('/', loginController.listarPessoas);
router.post('/', loginController.criarPessoa);
router.get('/:id', loginController.obterPessoa);
router.put('/:id', loginController.atualizarPessoa);
router.delete('/:id', loginController.deletarPessoa);

module.exports = router;
