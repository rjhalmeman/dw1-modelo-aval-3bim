const mysql = require('mysql2/promise');

// Configuração da conexão com o banco de dados MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Lageado001.',
  database: 'peer'//,
  //charset: 'utf8mb3'
};

// Pool de conexões para melhor performance
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;