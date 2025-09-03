//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');


exports.listarAvaliacaoHasQuestao = async (req, res) => {
  try {
    const result = await query('SELECT * FROM questao, avaliacao_has_questao WHERE avaliacao_id_avaliacao=?');
    // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterAvaliacaoHasQuestaoList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
        'SELECT * FROM questao, avaliacao_has_questao WHERE avaliacao_id_avaliacao=$1'      
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter avaliação has questão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
