//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudQuestao = (req, res) => {
  console.log('questaoController - Rota /abrirCrudQuestao - abrir o crudQuestao');
  res.sendFile(path.join(__dirname, '../../frontend/questao/questao.html'));
}

exports.listarQuestoes = async (req, res) => {
  try {
    const result = await query('SELECT * FROM questao ORDER BY id_questao');
    // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar questoes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.criarQuestao = async (req, res) => {
  //  console.log('Criando questao com dados:', req.body);
  try {
    const { id_questao, texto_questao, nota_maxima_questao, texto_complementar_questao} = req.body;

    // Validação básica
    if (!texto_questao || !nota_maxima_questao || !texto_complementar_questao) {
      return res.status(400).json({
        error: 'Texto, nota máxima e texto complementar são obrigatórios'
      });
    }

    const result = await query(
      'INSERT INTO questao (id_questao, texto_questao, nota_maxima_questao, texto_complementar_questao) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_questao, texto_questao, nota_maxima_questao, texto_complementar_questao]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar questao:', error);

    // Verifica se é erro de email duplicado (constraint unique violation)
    if (error.code === '23505' && error.constraint === 'questao_nota_maxima_questao_key') {
      return res.status(400).json({
        error: 'Email já está em uso'
      });
    }

    // Verifica se é erro de violação de constraint NOT NULL
    if (error.code === '23502') {
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.obterQuestao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM questao WHERE id_questao = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Questao não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter questao:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarQuestao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { texto_questao, nota_maxima_questao, texto_complementar_questao } = req.body;

   
    // Verifica se a questao existe
    const existingPersonResult = await query(
      'SELECT * FROM questao WHERE id_questao = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Questao não encontrada' });
    }

    // Constrói a query de atualização dinamicamente para campos não nulos
    const currentPerson = existingPersonResult.rows[0];
    const updatedFields = {
      texto_questao: texto_questao !== undefined ? texto_questao : currentPerson.texto_questao,
      nota_maxima_questao: nota_maxima_questao !== undefined ? nota_maxima_questao : currentPerson.nota_maxima_questao,
      texto_complementar_questao: texto_complementar_questao !== undefined ? texto_complementar_questao : currentPerson.texto_complementar_questao     
    };

    // Atualiza a questao
    const updateResult = await query(
      'UPDATE questao SET texto_questao = $1, nota_maxima_questao = $2, texto_complementar_questao = $3  WHERE id_questao = $4 RETURNING *',
      [updatedFields.texto_questao, updatedFields.nota_maxima_questao, updatedFields.texto_complementar_questao, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar questao:', error);

    // Verifica se é erro de email duplicado
    if (error.code === '23505' && error.constraint === 'questao_nota_maxima_questao_key') {
      return res.status(400).json({
        error: 'Email já está em uso por outra questao'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.deletarQuestao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a questao existe
    const existingPersonResult = await query(
      'SELECT * FROM questao WHERE id_questao = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Questao não encontrada' });
    }

    // Deleta a questao (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM questao WHERE id_questao = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar questao:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar questao com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Função adicional para buscar questao por email
exports.obterQuestaoPorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const result = await query(
      'SELECT * FROM questao WHERE nota_maxima_questao = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Questao não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter questao por email:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

