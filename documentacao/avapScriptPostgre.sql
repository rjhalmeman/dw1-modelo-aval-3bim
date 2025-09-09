-- Criação do schema e configuração do search_path
-- CREATE SCHEMA IF NOT EXISTS peer;
SET search_path TO public;

-- Tabela pessoa (deve ser criada primeiro devido às dependências)
CREATE TABLE pessoa (
  id_pessoa SERIAL PRIMARY KEY,
  nome_pessoa VARCHAR(50) NOT NULL,
  email_pessoa VARCHAR(70) NOT NULL UNIQUE,
  senha_pessoa VARCHAR(32) NOT NULL,
  primeiro_acesso_pessoa BOOLEAN NOT NULL DEFAULT TRUE,
  data_nascimento TIMESTAMP DEFAULT NULL
);

-- Tabela professor
CREATE TABLE professor (
  pessoa_id_pessoa INTEGER PRIMARY KEY,
  mnemonico_professor VARCHAR(45) NOT NULL,
  departamento_professor VARCHAR(45) DEFAULT NULL
);

-- Tabela avaliado
CREATE TABLE avaliado (
  pessoa_id_pessoa INTEGER PRIMARY KEY
);

-- Tabela avaliador
CREATE TABLE avaliador (
  pessoa_id_pessoa INTEGER PRIMARY KEY
);

-- Tabela questao
CREATE TABLE questao (
  id_questao SERIAL PRIMARY KEY,
  texto_questao VARCHAR(45) NOT NULL,
  nota_maxima_questao INTEGER NOT NULL,
  texto_complementar_questao VARCHAR(255) DEFAULT NULL
);

-- Tabela avaliacao
CREATE TABLE avaliacao (
  id_avaliacao SERIAL PRIMARY KEY,
  descricao_avaliacao VARCHAR(45) DEFAULT NULL,
  data_avaliacao TIMESTAMP NOT NULL,
  professor_pessoa_id_pessoa INTEGER NOT NULL,
  porcentagem_tolerancia_avaliacao DOUBLE PRECISION NOT NULL
);

-- Tabela avaliacao_has_avaliadores
CREATE TABLE avaliacao_has_avaliadores (
  avaliacao_id_avaliacao INTEGER NOT NULL,
  avaliador_pessoa_id_pessoa INTEGER NOT NULL,
  avaliado_pessoa_id_pessoa INTEGER NOT NULL,
  nota_avaliacao_has_avaliadores DOUBLE PRECISION NOT NULL,
  hora_avaliacao_has_avaliadores TIME NOT NULL,
  jaFoiAvaliado_avaliacao_has_avaliadores BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (avaliacao_id_avaliacao, avaliador_pessoa_id_pessoa, avaliado_pessoa_id_pessoa)
);

-- Tabela avaliacao_has_questao
CREATE TABLE avaliacao_has_questao (
  avaliacao_id_avaliacao INTEGER NOT NULL,
  questao_id_questao INTEGER NOT NULL,
  nota_avaliacao_has_questao INTEGER NOT NULL DEFAULT -1,
  PRIMARY KEY (avaliacao_id_avaliacao, questao_id_questao)
);

-- Adição das constraints de chave estrangeira
ALTER TABLE professor ADD CONSTRAINT fk_professor_pessoa1
  FOREIGN KEY (pessoa_id_pessoa)
  REFERENCES pessoa (id_pessoa)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE avaliado ADD CONSTRAINT fk_avaliado_pessoa1
  FOREIGN KEY (pessoa_id_pessoa)
  REFERENCES pessoa (id_pessoa)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE avaliador ADD CONSTRAINT fk_avaliador_pessoa1
  FOREIGN KEY (pessoa_id_pessoa)
  REFERENCES pessoa (id_pessoa)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE avaliacao ADD CONSTRAINT fk_avaliacao_professor1
  FOREIGN KEY (professor_pessoa_id_pessoa)
  REFERENCES professor (pessoa_id_pessoa)
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE avaliacao_has_avaliadores ADD CONSTRAINT fk_avaliacao_has_avaliadores_avaliacao
  FOREIGN KEY (avaliacao_id_avaliacao)
  REFERENCES avaliacao (id_avaliacao)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE avaliacao_has_avaliadores ADD CONSTRAINT fk_avaliacao_has_avaliadores_avaliado1
  FOREIGN KEY (avaliado_pessoa_id_pessoa)
  REFERENCES avaliado (pessoa_id_pessoa)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE avaliacao_has_avaliadores ADD CONSTRAINT fk_avaliacao_has_avaliadores_avaliador1
  FOREIGN KEY (avaliador_pessoa_id_pessoa)
  REFERENCES avaliador (pessoa_id_pessoa)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE avaliacao_has_questao ADD CONSTRAINT fk_avaliacao_has_questao_avaliacao1
  FOREIGN KEY (avaliacao_id_avaliacao)
  REFERENCES avaliacao (id_avaliacao)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE avaliacao_has_questao ADD CONSTRAINT fk_avaliacao_has_questao_questao1
  FOREIGN KEY (questao_id_questao)
  REFERENCES questao (id_questao)
  ON DELETE CASCADE ON UPDATE CASCADE;

  -- Inserindo 10 pessoas
INSERT INTO pessoa (nome_pessoa, email_pessoa, senha_pessoa, primeiro_acesso_pessoa, data_nascimento) VALUES
('João da Silva', 'jsilva@email.com', 'senha123', TRUE, '1985-05-20'),
('Bruno Souza', 'bruno.souza@email.com', 'senha234', TRUE, '1990-10-15'),
('Carlos Lima', 'carlos.lima@email.com', 'senha345', TRUE, '1982-08-10'),
('Daniela Castro', 'daniela.castro@email.com', 'senha456', TRUE, '1979-01-25'),
('Eduardo Alves', 'eduardo.alves@email.com', 'senha567', TRUE, '1995-12-12'),
('Fernanda Rocha', 'fernanda.rocha@email.com', 'senha678', TRUE, '1988-03-30'),
('Gustavo Melo', 'gustavo.melo@email.com', 'senha789', TRUE, '1977-07-17'),
('Helena Martins', 'helena.martins@email.com', 'senha890', TRUE, '1992-09-09'),
('Igor Ferreira', 'igor.ferreira@email.com', 'senha901', TRUE, '1980-04-04'),
('Juliana Dias', 'juliana.dias@email.com', 'senha012', TRUE, '1983-11-11');

-- Inserindo 10 professores (ligados às pessoas de id 1 a 10)
INSERT INTO professor (pessoa_id_pessoa, mnemonico_professor, departamento_professor) VALUES
(1, 'BEROLA', 'Matemática'),
(2, 'BSOUZA', 'Física'),
(10, 'JDIAS', 'Educação Física');

-- Inserindo 10 avaliados (pessoas 1 a 10)
INSERT INTO avaliado (pessoa_id_pessoa) VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10);

-- Inserindo 10 avaliadores (pessoas 1 a 10)
INSERT INTO avaliador (pessoa_id_pessoa) VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10);

-- Inserindo 10 questões
INSERT INTO questao (texto_questao, nota_maxima_questao, texto_complementar_questao) VALUES
('Clareza na exposição', 10, 'Avalia a clareza na comunicação do professor.'),
('Domínio do conteúdo', 10, NULL),
('Interação com alunos', 8, NULL),
('Uso de recursos didáticos', 7, NULL),
('Pontualidade', 5, NULL),
('Organização das aulas', 9, NULL),
('Capacidade de motivar', 8, NULL),
('Disponibilidade para dúvidas', 6, NULL),
('Avaliação justa', 7, NULL),
('Cumprimento do cronograma', 5, NULL);

-- Inserindo 10 avaliações (professores 1 a 10)
INSERT INTO avaliacao (descricao_avaliacao, data_avaliacao, professor_pessoa_id_pessoa, porcentagem_tolerancia_avaliacao) VALUES
('Avaliação semestral 1', '2025-05-01 09:00:00', 1, 0.05),
('Avaliação semestral 2', '2025-06-01 09:00:00', 2, 0.05),
('Avaliação semestral 3', '2025-07-01 09:00:00', 3, 0.05),
('Avaliação semestral 4', '2025-08-01 09:00:00', 4, 0.05),
('Avaliação semestral 5', '2025-09-01 09:00:00', 5, 0.05),
('Avaliação semestral 6', '2025-10-01 09:00:00', 6, 0.05),
('Avaliação semestral 7', '2025-11-01 09:00:00', 7, 0.05),
('Avaliação semestral 8', '2025-12-01 09:00:00', 8, 0.05),
('Avaliação semestral 9', '2026-01-01 09:00:00', 9, 0.05),
('Avaliação semestral 10', '2026-02-01 09:00:00', 10, 0.05);

-- Inserindo 5 registros na tabela avaliacao_has_avaliadores
INSERT INTO avaliacao_has_avaliadores (avaliacao_id_avaliacao, avaliador_pessoa_id_pessoa, avaliado_pessoa_id_pessoa, nota_avaliacao_has_avaliadores, hora_avaliacao_has_avaliadores, jaFoiAvaliado_avaliacao_has_avaliadores) VALUES
(1, 2, 1, 8.5, '10:00:00', TRUE),
(2, 3, 2, 9.0, '11:00:00', TRUE),
(3, 4, 3, 7.5, '09:30:00', TRUE),
(4, 5, 4, 8.0, '10:15:00', FALSE),
(5, 6, 5, 9.2, '12:00:00', TRUE);

-- Inserindo 5 registros na tabela avaliacao_has_questao
INSERT INTO avaliacao_has_questao (avaliacao_id_avaliacao, questao_id_questao, nota_avaliacao_has_questao) VALUES
(1, 1, 9),
(1, 2, 8),
(2, 3, 7),
(2, 4, 6),
(3, 5, 5);
