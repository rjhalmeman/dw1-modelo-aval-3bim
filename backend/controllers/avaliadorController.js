//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');


exports.listarAvaliador = async (req, res) => {
  try {
    const result = await query('SELECT * FROM avaliador ORDER BY pessoa_id_pessoa');
    // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar avaliador:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.criarAvaliador = async (req, res) => {
    console.log('Criando avaliador com dados:', req.body);
  try {
    const { pessoa_id_pessoa } = req.body;


    const result = await query(
      'INSERT INTO avaliador (pessoa_id_pessoa) VALUES ($1) RETURNING *',
      [pessoa_id_pessoa]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar avaliador:', error);


    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterAvaliador = async (req, res) => {
  // console.log('Obtendo avaliador com ID:', req.params.id);

  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM avaliador WHERE pessoa_id_pessoa = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Avaliador não encontrado' });
    }

    res.json(result.rows[0]); //achou o avaliador e retorna todos os dados do avaliador
    //console.log('Avaliador encontrado:', result.rows[0]);

  } catch (error) {
    console.error('Erro ao obter avaliador:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


exports.deletarAvaliador = async (req, res) => {
  console.log('Deletando avaliador com ID:', req.params.id);
  try {
    const id = parseInt(req.params.id);
    // Verifica se a avaliador existe
    const existingPersonResult = await query(
      'SELECT * FROM avaliador WHERE pessoa_id_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Avaliador não encontrado' });
    }

    // Deleta a avaliador (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM avaliador WHERE pessoa_id_pessoa = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar avaliador:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar avaliador com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
