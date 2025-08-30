# Instruções para executar esse projeto

## Pré-requisitos (tem que ter na sua máquina)
     o git instalado 
     o node, npm e o vscode instalados
     o postgreSQL instalado (saber o nome do usuário e a senha)
     o pgAdmin4 (ou similar) instalado 
    

### 1 - clone o projeto no seu computador (do github vai para sua máquina local)

1.1 escolha uma pasta que conterá o projeto

1.2 abra essa pasta no terminal (windows é power shell ou cmd)

1.3 digite ```git clone https://github.com/rjhalmeman/dw1-modelo-aval-3bim.git```

1.4 estando no terminal, depois de clonar, digite ```cd dw1-modelo-aval-3bim.git``` (para entrar na pasta do projeto)

1.5 - digite ```npm install```

1.6 na pasta do projeto, digite  ```code .``` e pressione enter (vai abrir o projeto no vscode)

### 2 - Criando o banco de dados

2.1 - abra o pgAdmin4 (o programa ou via navegador  - http://postgres@postgres.com )

2.2 - informe usuário e senha

2.3 - registre um servidor (caso não tenha nenhum)

2.4 - crie um banco de dados (sugiro que o nome seja ```avap```, para não ter que mexer na programação)

2.5 - vá no vscode (que deverá estar com o projeto aberto), na pasta documentacao tem um arquivo chamado avapScriptPostgre.sql

2.6 - copie o conteúdo desse arquivo e cole em uma janela de execução de SQL no pgAdmin4

2.7 - execute o script (deve criar as tabelas do banco de dados)

2.8 - confira se foram criadas as tabelas

### 3 - Ajustando os parâmetros para acessar o banco de dados

3.1 - abra o arquivo database.js que está na pasta backend do projeto

3.2 - modifique 

```
                user: 'radames', // Usuário do PostgreSQL (ajuste conforme necessário)

                password: 'Lageado001.', //sua senha no postgres

                database: 'avap', //nome do banco de dados, caso você tenha mudado
```

3.3 - salve o arquivo

### 4 - subir o servidor

4.1 - no terminal, na pasta do projeto, digite ```node backend/server.js``` (deverá subir o servidor)

### 5 - Executando o frontend

5.1 - No vscode, procure o index.html (está na pasta raíz do projeto)

5.2 - execute usando o Live Server







