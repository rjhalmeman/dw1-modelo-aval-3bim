const express = require('express');
const app = express();

// Configurações do servidor - quando em produção, você deve substituir o IP e a porta pelo do seu servidor remoto
//const HOST = '192.168.1.100'; // Substitua pelo IP do seu servidor remoto
const HOST = 'localhost'; // Para desenvolvimento local
const PORT_FIXA = 3001; // Porta fixa

// Middleware para permitir CORS (Cross-Origin Resource Sharing)
// Isso é útil se você estiver fazendo requisições de um frontend que está rodando em um domínio diferente
// ou porta do backend.
// Em produção, você deve restringir isso para domínios específicos por segurança.
// Aqui, estamos permitindo qualquer origem, o que é útil para desenvolvimento, mas deve ser ajustado em produção.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Importando as rotas
const pessoaRoutes = require('../routes/pessoaRoutes');
// const produtoRoutes = require('./routes/produto');

// Middlewares
app.use(express.json());

// Rotas
app.use('/pessoas', pessoaRoutes);
// app.use('/produtos', produtoRoutes);

// Rota padrão
app.get('/', (req, res) => {
  res.send('O server está funcionando - essa é a rota raiz / !');
});

// Iniciando o servidor

/*
process.env.PORT busca a variável de ambiente PORT do sistema onde o servidor está sendo executado.
Se essa variável não estiver definida (por exemplo, em desenvolvimento local), o valor padrão 3000 será usado (por causa do operador lógico ||).
Isso é comum em ambientes de hospedagem (como Heroku, AWS, etc.), onde a porta é atribuída dinamicamente pelo serviço.
*/

const PORT = process.env.PORT || PORT_FIXA;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
