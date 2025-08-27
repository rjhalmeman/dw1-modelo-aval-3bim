//import { query } from '../database.js';
const { query } = require('../database');
// Funções do controller

const path = require('path');

exports.abrirCrudProfessor = (req, res) => {
  //  console.log('professorController - Rota /abrirCrudProfessor - abrir o crudProfessor');
  res.sendFile(path.join(__dirname, '../../frontend/professor/professor.html'));
}

exports.listarProfessor = async (req, res) => {
  try {
    const result = await query('SELECT * FROM professor ORDER BY id_professor');
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
  console.log('Obtendo professor com ID:', req.params.id);

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
  try {
    const id = parseInt(req.params.id);
    const { nome_professor, email_professor, senha_professor, primeiro_acesso_professor, data_nascimento } = req.body;

    // Validação de email se fornecido
    if (email_professor) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_professor)) {
        return res.status(400).json({
          error: 'Formato de email inválido'
        });
      }
    }
    // Verifica se a professor existe
    const existingPersonResult = await query(
      'SELECT * FROM professor WHERE id_professor = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrada' });
    }

    // Constrói a query de atualização dinamicamente para campos não nulos
    const currentPerson = existingPersonResult.rows[0];
    const updatedFields = {
      nome_professor: nome_professor !== undefined ? nome_professor : currentPerson.nome_professor,
      email_professor: email_professor !== undefined ? email_professor : currentPerson.email_professor,
      senha_professor: senha_professor !== undefined ? senha_professor : currentPerson.senha_professor,
      primeiro_acesso_professor: primeiro_acesso_professor !== undefined ? primeiro_acesso_professor : currentPerson.primeiro_acesso_professor,
      data_nascimento: data_nascimento !== undefined ? data_nascimento : currentPerson.data_nascimento
    };

    // Atualiza a professor
    const updateResult = await query(
      'UPDATE professor SET nome_professor = $1, email_professor = $2, senha_professor = $3, primeiro_acesso_professor = $4, data_nascimento = $5 WHERE id_professor = $6 RETURNING *',
      [updatedFields.nome_professor, updatedFields.email_professor, updatedFields.senha_professor, updatedFields.primeiro_acesso_professor, updatedFields.data_nascimento, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar professor:', error);

    // Verifica se é erro de email duplicado
    if (error.code === '23505' && error.constraint === 'professor_email_professor_key') {
      return res.status(400).json({
        error: 'Email já está em uso por outra professor'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

exports.deletarProfessor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Verifica se a professor existe
    const existingPersonResult = await query(
      'SELECT * FROM professor WHERE id_professor = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrada' });
    }

    // Deleta a professor (as constraints CASCADE cuidarão das dependências)
    await query(
      'DELETE FROM professor WHERE id_professor = $1',
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

// Função adicional para buscar professor por email
exports.obterProfessorPorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const result = await query(
      'SELECT * FROM professor WHERE email_professor = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter professor por email:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Função para atualizar apenas a senha
exports.atualizarSenha = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { senha_atual, nova_senha } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    if (!senha_atual || !nova_senha) {
      return res.status(400).json({
        error: 'Senha atual e nova senha são obrigatórias'
      });
    }

    // Verifica se a professor existe e a senha atual está correta
    const personResult = await query(
      'SELECT * FROM professor WHERE id_professor = $1',
      [id]
    );

    if (personResult.rows.length === 0) {
      return res.status(404).json({ error: 'Professor não encontrada' });
    }

    const person = personResult.rows[0];

    // Verificação básica da senha atual (em produção, use hash)
    if (person.senha_professor !== senha_atual) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    // Atualiza apenas a senha
    const updateResult = await query(
      'UPDATE professor SET senha_professor = $1 WHERE id_professor = $2 RETURNING id_professor, nome_professor, email_professor, primeiro_acesso_professor, data_nascimento',
      [nova_senha, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}