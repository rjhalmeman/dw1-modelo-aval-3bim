//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');


exports.listarAvaliado = async (req, res) => {
  try {
    const result = await query('SELECT * FROM avaliado ORDER BY pessoa_id_pessoa');
    // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar avaliado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.criarAvaliado = async (req, res) => {
    console.log('Criando avaliado com dados:', req.body);
  try {
    const { pessoa_id_pessoa } = req.body;


    const result = await query(
      'INSERT INTO avaliado (pessoa_id_pessoa) VALUES ($1) RETURNING *',
      [pessoa_id_pessoa]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar avaliado:', error);


    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterAvaliado = async (req, res) => {
  // console.log('Obtendo avaliado com ID:', req.params.id);

  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM avaliado WHERE pessoa_id_pessoa = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Avaliado não encontrado' });
    }

    res.json(result.rows[0]); //achou o avaliado e retorna todos os dados do avaliado
    //console.log('Avaliado encontrado:', result.rows[0]);

  } catch (error) {
    console.error('Erro ao obter avaliado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


exports.deletarAvaliado = async (req, res) => {
  console.log('Deletando avaliado com ID:', req.params.id);
  try {
    const id = parseInt(req.params.id);
    // Verifica se a avaliado existe
    const existingPersonResult = await query(
      'SELECT * FROM avaliado WHERE pessoa_id_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Avaliado não encontrado' });
    }

    // Deleta a avaliado (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM avaliado WHERE pessoa_id_pessoa = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar avaliado:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar avaliado com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
