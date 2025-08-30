//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudAvaliacao = (req, res) => {
//  console.log('avaliacaoController - Rota /abrirCrudAvaliacao - abrir o crudAvaliacao');
  res.sendFile(path.join(__dirname, '../../frontend/avaliacao/avaliacao.html'));
} //

exports.listarAvaliacoes = async (req, res) => {
  try {
    const result = await query('SELECT * FROM avaliacao ORDER BY id_avaliacao');
    // console.log('Resultado do SELECT:', result.rows);//verifica se está retornando algo
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar avaliacoes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.criarAvaliacao = async (req, res) => {
    console.log('Criando avaliacao com dados:', req.body);
  try {
    const { id_avaliacao, descricao_avaliacao, data_avaliacao, professor_pessoa_id_pessoa, porcentagem_tolerancia_avaliacao} = req.body;

   // console.log('Dados recebidos:', { id_avaliacao, descricao_avaliacao, data_avaliacao, professor_pessoa_id_pessoa, porcentagem_tolerancia_avaliacao });

    // Validação básica
    if (!descricao_avaliacao || !data_avaliacao || !professor_pessoa_id_pessoa || !porcentagem_tolerancia_avaliacao) {
      return res.status(400).json({
        error: 'Texto, nota máxima e texto complementar são obrigatórios'
      });
    }

    const result = await query(
      'INSERT INTO avaliacao (id_avaliacao, descricao_avaliacao, data_avaliacao, professor_pessoa_id_pessoa, porcentagem_tolerancia_avaliacao) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_avaliacao, descricao_avaliacao, data_avaliacao, professor_pessoa_id_pessoa,porcentagem_tolerancia_avaliacao]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar avaliacao:', error);


    // Verifica se é erro de violação de constraint NOT NULL
    if (error.code === '23502') {
      return res.status(400).json({
        error: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}



exports.obterAvaliacao = async (req, res) => {
  //console.log('Obtendo avaliacao com ID:', req.params.id);

  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM avaliacao WHERE id_avaliacao = $1',
      [id]
    );

    console.log('Resultado do SELECT:', result.rows); // Verifica se está retornando algo

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Avaliacao não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter avaliacao:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.atualizarAvaliacao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { descricao_avaliacao, data_avaliacao, professor_pessoa_id_pessoa, porcentagem_tolerancia_avaliacao } = req.body;

   
    // Verifica se a avaliacao existe
    const existingPersonResult = await query(
      'SELECT * FROM avaliacao WHERE id_avaliacao = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Avaliacao não encontrada' });
    }

    // Constrói a query de atualização dinamicamente para campos não nulos
    const currentPerson = existingPersonResult.rows[0];
    const updatedFields = {
      descricao_avaliacao: descricao_avaliacao !== undefined ? descricao_avaliacao : currentPerson.descricao_avaliacao,
      data_avaliacao: data_avaliacao !== undefined ? data_avaliacao : currentPerson.data_avaliacao,
      professor_pessoa_id_pessoa: professor_pessoa_id_pessoa !== undefined ? professor_pessoa_id_pessoa : currentPerson.professor_pessoa_id_pessoa,
      porcentagem_tolerancia_avaliacao: porcentagem_tolerancia_avaliacao !== undefined ? porcentagem_tolerancia_avaliacao : currentPerson.porcentagem_tolerancia_avaliacao     
    };

    // Atualiza a avaliacao
    const updateResult = await query(
      'UPDATE avaliacao SET descricao_avaliacao = $1, data_avaliacao = $2, professor_pessoa_id_pessoa = $3, porcentagem_tolerancia_avaliacao=$4  WHERE id_avaliacao = $5 RETURNING *',
      [updatedFields.descricao_avaliacao, updatedFields.data_avaliacao, updatedFields.professor_pessoa_id_pessoa, updatedFields.porcentagem_tolerancia_avaliacao, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar avaliacao:', error);



    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.deletarAvaliacao = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a avaliacao existe
    const existingPersonResult = await query(
      'SELECT * FROM avaliacao WHERE id_avaliacao = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Avaliacao não encontrada' });
    }

    // Deleta a avaliacao (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM avaliacao WHERE id_avaliacao = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar avaliacao:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar avaliacao com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Função adicional para buscar avaliacao por descrição
exports.obterAvaliacaoPorDescricao = async (req, res) => {
  try {
    const { descricao: descricao } = req.params;

    if (!descricao) {
      return res.status(400).json({ error: 'A descrição é é obrigatória' });
    }

    const result = await query(
      'SELECT * FROM avaliacao WHERE descricao_avaliacao = $1',
      [descricao]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Avaliacao não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter avaliacao por descrição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

