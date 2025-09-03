# Backend da API - LIBRAS-EDU

Este diretório contém a API backend do projeto LIBRAS-EDU. É uma API RESTful construída com Node.js e Express, responsável por toda a lógica de negócios, gestão de dados e comunicação com o banco de dados PostgreSQL.

A arquitetura do projeto segue um padrão em camadas (`Rotas` -> `Middlewares` -> `Controladores` -> `Serviços` -> `Modelo`), o que garante um código organizado, desacoplado e escalável.

---

### ✨ Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Ambiente de execução JavaScript. |
| **Framework** | Express.js | Framework para a construção da API. |
| **Banco de Dados** | PostgreSQL | Banco de dados relacional para armazenamento dos dados. |
| **ORM** | Prisma | Ferramenta para acesso e migração do banco de dados. |
| **Segurança** | BcryptJS & JWT | Para hashing de senhas e autenticação baseada em tokens. |
| **Containerização** | Docker | Garante um ambiente de desenvolvimento e produção consistente. |

---

### 📂 Estrutura de Pastas

- **/prisma**: Contém o `schema.prisma` que define o modelo de dados e as migrações.
- **/src/routes**: Mapeia os endpoints da API para os métodos dos controladores. Contém um `index.js` que agrega todas as rotas.
- **/src/controllers**: Recebem as requisições HTTP e orquestram o fluxo, chamando a camada de serviço.
- **/src/services**: Contêm toda a lógica de negócio da aplicação, interagindo com o Prisma.
- **/src/middlewares**: Contém funções que interceptam requisições, como a de autenticação (`authMiddleware.js`).
- **/generated/prisma**: Contém o Prisma Client gerado automaticamente.
- **server.js**: Ponto de entrada da aplicação, onde o servidor Express é configurado.

---

### 🔌 Endpoints da API

A base de todos os endpoints é `http://localhost:3000/api`.

#### Autenticação (Público)
* `POST /auth/login`: Autentica um utilizador com email e senha, retornando um token JWT e os dados do utilizador.

#### Recursos Públicos e Registo
* `POST /users`: Regista um novo utilizador no sistema.
* `GET, POST /instituicoes`: Lista ou cria novas instituições.
* `GET, POST /disciplinas`: Lista ou cria novas disciplinas.
* `GET /cursos`, `GET /areas-conhecimento`, `GET /sinais`.

#### Submissão de Sinais (Exige Autenticação)
* `POST /sinais-propostos`: Submete uma nova proposta de sinal. O `proposerId` é obtido automaticamente do token do utilizador logado.

#### Painel do Avaliador (Exige `AVALIADOR` ou `ADMIN`)
* `GET /evaluator/proposals/pending`: Retorna uma lista de todas as propostas com status `PENDENTE`.
* `GET /evaluator/proposals/aprovado`: Retorna uma lista de todas as propostas com status `APROVADO`.
* `GET /evaluator/proposals/rejeitado`: Retorna uma lista de todas as propostas com status `REJEITADO`.
* `POST /evaluator/proposals/:id/evaluate`: Submete uma avaliação para uma proposta, alterando o seu status e, se aprovada, criando um novo `Sinal` oficial.

#### Painel de Administração (Exige `ADMIN`)
* `GET /admin/stats`: Retorna estatísticas agregadas para o dashboard.
* `GET /admin/recent-users`: Retorna os últimos utilizadores registados.
* `GET /admin/proposals-by-day`: Retorna a contagem de propostas dos últimos 7 dias.
* `GET /admin/users-by-role`: Retorna a contagem de utilizadores agrupados por perfil.
* `GET /admin/users`: Retorna uma lista de todos os utilizadores.
* `PUT /admin/users/:id`: Atualiza um utilizador específico.
* `DELETE /admin/users/:id`: Apaga um utilizador específico.
* `GET /admin/evaluators`: Retorna uma lista de todos os utilizadores com o perfil `AVALIADOR`.
* `POST /admin/evaluators`: Cria um novo utilizador com o perfil `AVALIADOR`.
* `GET /admin/sinais-propostos`: Retorna uma lista das propostas pendentes para consulta.
* `GET /admin/sinais-oficiais`: Retorna uma lista de todos os sinais aprovados.

---

### 🚀 Como Executar

O backend é gerido pelo ficheiro `docker-compose.yml` na raiz do projeto. Consulte o `README.md` principal para as instruções completas de como iniciar todo o ambiente.

Para executar comandos específicos do Prisma (como migrações), use `docker-compose exec`:
```bash
sudo docker-compose exec api npx prisma migrate dev --name "nome-da-migracao"