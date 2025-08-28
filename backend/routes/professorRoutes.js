const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');

// CRUD de Professors


router.get('/', professorController.listarProfessor);
router.post('/', professorController.criarProfessor);
router.get('/:id', professorController.obterProfessor);
router.put('/:id', professorController.atualizarProfessor);
router.delete('/:id', professorController.deletarProfessor);

module.exports = router;
