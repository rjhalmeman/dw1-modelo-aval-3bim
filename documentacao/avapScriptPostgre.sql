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