//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');


exports.listarProfessor = async (req, res) => {
  try {
    const result = await query('SELECT * FROM professor ORDER BY pessoa_id_pessoa');
    // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.criarProfessor = async (req, res) => {
  //  console.log('Criando professor com dados:', req.body);
  try {
    const { pessoa_id_pessoa, mnemonico_professor, departamento_professor } = req.body;


    const result = await query(
      'INSERT INTO professor (pessoa_id_pessoa, mnemonico_professor, departamento_professor) VALUES ($1, $2, $3) RETURNING *',
      [pessoa_id_pessoa, mnemonico_professor, departamento_professor]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar professor:', error);


    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterProfessor = async (req, res) => {
  // console.log('Obtendo professor com ID:', req.params.id);

  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM professor WHERE pessoa_id_pessoa = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    res.json(result.rows[0]); //achou o professor e retorna todos os dados do professor
    //console.log('Professor encontrado:', result.rows[0]);

  } catch (error) {
    console.error('Erro ao obter professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarProfessor = async (req, res) => {
  console.log('Atualizando professor com ID:', req.params.id, 'e dados:', req.body);
  try {
    const id = parseInt(req.params.id);

    const { mnemonico_professor, departamento_professor } = req.body;
    console.log('ID do professor a ser atualizado:' + id + ' Dados recebidos:' + mnemonico_professor + ' - ' + departamento_professor);


    // Verifica se a professor existe
    const existingPersonResult = await query(
      'SELECT * FROM professor WHERE pessoa_id_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    // Constrói a query de atualização dinamicamente para campos não nulos
    const currentPerson = existingPersonResult.rows[0];

    const updatedFields = {
      mnemonico_professor: mnemonico_professor,
      departamento_professor: departamento_professor
    };
    // console.log('Campos da atualização:', updatedFields);

    // Atualiza a professor
    const updateResult = await query(
      'UPDATE professor SET mnemonico_professor = $1, departamento_professor = $2 WHERE pessoa_id_pessoa = $3 RETURNING *',
      [updatedFields.mnemonico_professor, updatedFields.departamento_professor, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar professor:', error);

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.deletarProfessor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a professor existe
    const existingPersonResult = await query(
      'SELECT * FROM professor WHERE pessoa_id_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrado' });
    }

    // Deleta a professor (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM professor WHERE pessoa_id_pessoa = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar professor:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar professor com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
