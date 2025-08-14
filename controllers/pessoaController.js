const db = require('../backend/database.js');

// Funções do controller
exports.listarPessoas = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pessoa');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar pessoas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.criarPessoa = async (req, res) => {
  try {
    const { nome_pessoa, email_pessoa, senha_pessoa, primeiroAcesso = 1 } = req.body;
    
    // Validação básica
    if (!nome_pessoa || !email_pessoa || !senha_pessoa) {
      return res.status(400).json({ 
        error: 'Nome, email e senha são obrigatórios' 
      });
    }
    
    const [result] = await db.execute(
      'INSERT INTO pessoa (nome_pessoa, email_pessoa, senha_pessoa, primeiroAcesso) VALUES (?, ?, ?, ?)',
      [nome_pessoa, email_pessoa, senha_pessoa, primeiroAcesso]
    );
    
    // Busca a pessoa criada para retornar
    const [rows] = await db.execute(
      'SELECT * FROM pessoa WHERE id_pessoa = ?',
      [result.insertId]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);
    
    // Verifica se é erro de email duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        error: 'Email já está em uso' 
      });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.obterPessoa = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }
    
    const [rows] = await db.execute(
      'SELECT * FROM pessoa WHERE id_pessoa = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao obter pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.atualizarPessoa = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome_pessoa, email_pessoa, senha_pessoa, primeiroAcesso } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }
    
    // Verifica se a pessoa existe
    const [existingPerson] = await db.execute(
      'SELECT * FROM pessoa WHERE id_pessoa = ?',
      [id]
    );
    
    if (existingPerson.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    
    // Atualiza a pessoa
    await db.execute(
      'UPDATE pessoa SET nome_pessoa = ?, email_pessoa = ?, senha_pessoa = ?, primeiroAcesso = ? WHERE id_pessoa = ?',
      [nome_pessoa, email_pessoa, senha_pessoa, primeiroAcesso, id]
    );
    
    // Busca a pessoa atualizada
    const [updatedRows] = await db.execute(
      'SELECT * FROM pessoa WHERE id_pessoa = ?',
      [id]
    );
    
    res.json(updatedRows[0]);
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);
    
    // Verifica se é erro de email duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ 
        error: 'Email já está em uso por outra pessoa' 
      });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.deletarPessoa = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }
    
    // Verifica se a pessoa existe
    const [existingPerson] = await db.execute(
      'SELECT * FROM pessoa WHERE id_pessoa = ?',
      [id]
    );
    
    if (existingPerson.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    
    // Deleta a pessoa
    await db.execute(
      'DELETE FROM pessoa WHERE id_pessoa = ?',
      [id]
    );
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};