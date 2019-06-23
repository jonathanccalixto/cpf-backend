# CPF backend

Um servidor backend escrito em [nodejs](https://nodejs.org), para consulta de CPFs

- Versão do node

Este projeto utiliza a versão 8.16.0 do

- Dependências do sistema

O sistema utiliza:

- nodejs v8.16.0
- npm v6.4.1
- yarn v1.16.0
- docker v18.09.6
- docker-compose v1.24.0

* Configuração

Para iniciar o projeto em desenvolvimento, basta instalar o docker e docker-compose, e executar o comando

```bash
  docker-compose up -d
```

para exibir os logs do ambiente de teste, basta executar o seguinte comando após iniciar o docker:

```bash
  docker logs -f cpf-backend_test_1
```

para exibir os logs da aplicação, basta executar o seguinte comando após iniciar o docker:

```bash
  docker logs -f cpf-backend_app_1
```

- Criação de banco de dados

A aplicação utiliza o banco mongoDB, não precisa de ser criado. Tendo ele iniciado, basta utilizar.

- Inicialização do banco de dados

Na aplicação foi construido via docker, então basta executar o comando do docker compose que ele se inicializará.

- Como executar o conjunto de testes

Já existe um container do docker para executar os testes, mas caso precise ou queira executar local seria:

```bash
  yarn test
```

- endpoints

Após executar o docker, inicializará o servidor de aplicação, contendo os seguintes endpoints:

- **GET /cpf/status**: recebe via `query` o paramentro `cpf` que será usado para consultar o status do cpf.
  Retorna:
  - **FREE** se não estiver na blacklist
  - **BLOCK** se estiver na blacklist
  - { message: '', fields: [ '' ]} se ocorreu algum erro de processamento, onde `message` é uma mensagem generica e `fields` é um array de mensagem relacionada aos campos validados. Ex: _{ "message": "One or more validation errors occurred:", "fields": [ "\"cpf\" is not allowed to be empty" ] }_
- **POST /cpf/add**: recebe via `body` o paramentro `cpf` que será usado para adicionar o cpf na blacklist.
  Retorna:
  - { "cpf": "", "removedAt": null, : "createdAt": "", "updatedAt": "" } sempre que um cpf é adicionando na blacklist. Exemplo: _{ "cpf": "638.174.677-70", "removedAt": null, "createdAt": "2019-06-23T19:43:54.103Z", "updatedAt": "2019-06-23T19:43:54.103Z" }_
  - { message: '', fields: [ '' ]} se ocorreu algum erro de processamento, onde `message` é uma mensagem generica e `fields` é um array de mensagem relacionada aos campos validados. Ex: _{ "message": "One or more validation errors occurred:", "fields": [ "\"cpf\" was added in blacklist" ] }_
- **DELETE /cpf/remove**: recebe via `body` o paramentro `cpf` que será usado para adicionar o cpf na blacklist.
  Retorna:
  - { "cpf": "", "removedAt": null, : "createdAt": "", "updatedAt": "" } sempre que um cpf é removido da blacklist. Exemplo: _{ "cpf": "638.174.677-70", "removedAt": "2019-06-23T19:48:31.465Z", "createdAt": "2019-06-23T19:43:54.103Z", "updatedAt": "2019-06-23T19:48:31.465Z" }_
  - { message: '', fields: [ '' ]} se ocorreu algum erro de processamento, onde `message` é uma mensagem generica e `fields` é um array de mensagem relacionada aos campos validados. Ex: _{ "message": "One or more validation errors occurred:", "fields": [ "\"cpf\" was not added in blacklist" ] }_
