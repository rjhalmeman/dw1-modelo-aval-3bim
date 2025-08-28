# Projeto didático/modelo

AVAP - Sistema de Avaliação por Pares

CRUD Questao é para uma tabela que não depende de outras

CRUD Pessoa tem relacionamentos com professor, avaliado e avaliador (relações de 1:1)

---

### 1 - clonar o repositório https://github.com/rjhalmeman/dw1-modelo-aval-3bim
1.1 - abrir a pasta no terminal (ou cmd)

1.2 - execute npm install (vai instalar o express, cors, etc)

1.3 - abrir a pasta que foi criada no vscode. (code .)

1.4 - procure a pasta documentacao no projeto

### 2 - preparar o banco de dados

2.1 - acessar o postgreSQL (postgres para os íntimos) via pgAdmin4 ou interface web.

2.2 - usuário: postgres senha: postgres (nos labs da utfpr) ou usuario:aluno senha: postgres

2.3 - criar um banco de dados chamado avap

2.4 - pegar na pasta documentacao o arquivo avapScriptPostgre.sql

2.5 - copie e cole no pgAdmin4

2.6 - execute o script

2.7 - deverá criar as tabelas no bd
