const db = require('../database.js');


// Funções do controller
exports.listarPessoas = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pessoa ORDER BY id_pessoa');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar pessoas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.verificarEmail = async (req, res) => {
  const { email } = req.body;

  const sql = 'SELECT nome_pessoa FROM pessoa WHERE email_pessoa = $1'; // Postgres usa $1, $2...

  console.log('rota verificarEmail:', sql, email);

  try {
    const result = await db.query(sql, [email]); // igual listarPessoas

    if (result.rows.length > 0) {
      return res.json({ status: 'existe', nome: result.rows[0].nome_pessoa });
    }

    res.json({ status: 'nao_encontrado' });
  } catch (err) {
    console.error('Erro em verificarEmail:', err);
    res.status(500).json({ status: 'erro', mensagem: err.message });
  }
};


// Verificar senha
exports.verificarSenha = async (req, res) => {
  const { email, senha } = req.body;

  const sqlPessoa = `
    SELECT id_pessoa, nome_pessoa 
    FROM pessoa 
    WHERE email_pessoa = $1 AND senha_pessoa = $2
  `;
  const sqlProfessor = `
    SELECT mnemonico_professor 
    FROM professor 
    WHERE pessoa_id_pessoa = $1
  `;

  console.log('Rota verificarSenha:', sqlPessoa, email, senha);

  try {
    // 1. Verifica se existe pessoa com email/senha
    const resultPessoa = await db.query(sqlPessoa, [email, senha]);

    if (resultPessoa.rows.length === 0) {
      return res.json({ status: 'senha_incorreta' });
    }

    const { id_pessoa, nome_pessoa } = resultPessoa.rows[0];
    console.log('Usuário encontrado:', resultPessoa.rows[0]);

    // 2. Verifica se é professor
    const resultProfessor = await db.query(sqlProfessor, [id_pessoa]);

    const mnemonicoProfessor = resultProfessor.rows.length > 0
      ? resultProfessor.rows[0].mnemonico_professor
      : null;

    if (mnemonicoProfessor) {
      console.log('Usuário é professor, mnemonico:', mnemonicoProfessor);
    } else {
      console.log('Usuário não é professor');
    }

    // 3. Define cookie
    res.cookie('usuarioLogado', nome_pessoa, {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });

    return res.json({
      status: 'ok',
      nome: nome_pessoa,
      mnemonicoProfessor,
    });

  } catch (err) {
    console.error('Erro ao verificar senha:', err);
    return res.status(500).json({ status: 'erro', mensagem: err.message });
  }
}


// Logout
exports.logout = (req, res) => {
  res.clearCookie('usuarioLogado', {
    sameSite: 'None',
    secure: true,
    httpOnly: true,
    path: '/',
  });
  console.log("Cookie 'usuarioLogado' removido com sucesso");
  res.json({ status: 'deslogado' });
}


exports.criarPessoa = async (req, res) => {
  //  console.log('Criando pessoa com dados:', req.body);
  try {
    const { id_pessoa, nome_pessoa, email_pessoa, senha_pessoa, primeiro_acesso_pessoa = true, data_nascimento } = req.body;

    // Validação básica
    if (!nome_pessoa || !email_pessoa || !senha_pessoa) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_pessoa)) {
      return res.status(400).json({
        error: 'Formato de email inválido'
      });
    }

    const result = await db.query(
      'INSERT INTO pessoa (id_pessoa, nome_pessoa, email_pessoa, senha_pessoa, primeiro_acesso_pessoa, data_nascimento) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id_pessoa, nome_pessoa, email_pessoa, senha_pessoa, primeiro_acesso_pessoa, data_nascimento]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);

    // Verifica se é erro de email duplicado (constraint unique violation)
    if (error.code === '23505' && error.constraint === 'pessoa_email_pessoa_key') {
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
};

exports.obterPessoa = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    const result = await db.query(
      'SELECT * FROM pessoa WHERE id_pessoa = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter pessoa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.atualizarPessoa = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome_pessoa, email_pessoa, senha_pessoa, primeiro_acesso_pessoa, data_nascimento } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID deve ser um número válido' });
    }

    // Validação de email se fornecido
    if (email_pessoa) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_pessoa)) {
        return res.status(400).json({
          error: 'Formato de email inválido'
        });
      }
    }

    // Verifica se a pessoa existe
    const existingPersonResult = await db.query(
      'SELECT * FROM pessoa WHERE id_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    // Constrói a query de atualização dinamicamente para campos não nulos
    const currentPerson = existingPersonResult.rows[0];
    const updatedFields = {
      nome_pessoa: nome_pessoa !== undefined ? nome_pessoa : currentPerson.nome_pessoa,
      email_pessoa: email_pessoa !== undefined ? email_pessoa : currentPerson.email_pessoa,
      senha_pessoa: senha_pessoa !== undefined ? senha_pessoa : currentPerson.senha_pessoa,
      primeiro_acesso_pessoa: primeiro_acesso_pessoa !== undefined ? primeiro_acesso_pessoa : currentPerson.primeiro_acesso_pessoa,
      data_nascimento: data_nascimento !== undefined ? data_nascimento : currentPerson.data_nascimento
    };

    // Atualiza a pessoa
    const updateResult = await db.query(
      'UPDATE pessoa SET nome_pessoa = $1, email_pessoa = $2, senha_pessoa = $3, primeiro_acesso_pessoa = $4, data_nascimento = $5 WHERE id_pessoa = $6 RETURNING *',
      [updatedFields.nome_pessoa, updatedFields.email_pessoa, updatedFields.senha_pessoa, updatedFields.primeiro_acesso_pessoa, updatedFields.data_nascimento, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);

    // Verifica se é erro de email duplicado
    if (error.code === '23505' && error.constraint === 'pessoa_email_pessoa_key') {
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
    const existingPersonResult = await db.query(
      'SELECT * FROM pessoa WHERE id_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    // Deleta a pessoa (as constraints CASCADE cuidarão das dependências)
    await db.query(
      'DELETE FROM pessoa WHERE id_pessoa = $1',
      [id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error);

    // Verifica se é erro de violação de foreign key (dependências)
    if (error.code === '23503') {
      return res.status(400).json({
        error: 'Não é possível deletar pessoa com dependências associadas'
      });
    }

    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Função adicional para buscar pessoa por email
exports.obterPessoaPorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const result = await db.query(
      'SELECT * FROM pessoa WHERE email_pessoa = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao obter pessoa por email:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

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

    // Verifica se a pessoa existe e a senha atual está correta
    const personResult = await db.query(
      'SELECT * FROM pessoa WHERE id_pessoa = $1',
      [id]
    );

    if (personResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    const person = personResult.rows[0];

    // Verificação básica da senha atual (em produção, use hash)
    if (person.senha_pessoa !== senha_atual) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    // Atualiza apenas a senha
    const updateResult = await db.query(
      'UPDATE pessoa SET senha_pessoa = $1 WHERE id_pessoa = $2 RETURNING id_pessoa, nome_pessoa, email_pessoa, primeiro_acesso_pessoa, data_nascimento',
      [nova_senha, id]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

