# Backend da API - LIBRAS-EDU

Este diretório contém a API backend do projeto LIBRAS-EDU. É uma API RESTful construída com Node.js, Express e Prisma, responsável por toda a lógica de negócios, gerenciamento de dados e comunicação com o banco de dados PostgreSQL.

---

### ✨ Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Ambiente de execução JavaScript. |
| **Framework** | Express.js | Framework minimalista para a construção da API. |
| **Banco de Dados** | PostgreSQL | Banco de dados relacional para armazenamento dos dados. |
| **ORM** | Prisma | Ferramenta para acesso e migração do banco de dados. |
| **Containerização** | Docker | Garante um ambiente de desenvolvimento e produção consistente. |

---

### 📂 Estrutura de Pastas

- **/prisma**: Contém o schema do banco de dados (`schema.prisma`) e os arquivos de migração.
- **/src/routes**: Contém a definição dos endpoints da API, separados por recurso (Usuários, Áreas, Sinais).
- **server.js**: Ponto de entrada da aplicação, onde o servidor Express é configurado e iniciado.
- **nodemon.json**: Arquivo de configuração do Nodemon para o hot-reloading durante o desenvolvimento.
- **Dockerfile**: Receita para construir a imagem Docker da API.

---

### 🔌 Endpoints da API

A API base roda em `http://localhost:3000/api`.

- **Recurso: Usuários (`/users`)**
  - `GET /users`: Lista todos os usuários.
  - `GET /users/:id`: Busca um usuário por ID.
  - `POST /users`: Cria um novo usuário.
  - `PUT /users/:id`: Atualiza um usuário.
  - `DELETE /users/:id`: Deleta um usuário.

- **Recurso: Áreas de Conhecimento (`/areas`)**
  - `GET /areas`: Lista todas as áreas.
  - `POST /areas`: Cria uma nova área.
  - `PUT /areas/:id`: Atualiza uma área.
  - `DELETE /areas/:id`: Deleta uma área.

- **Recurso: Sinais (`/sinais`)**
  - `GET /sinais`: Lista todos os sinais, incluindo dados do autor e da área.
  - `POST /sinais`: Cria uma nova proposta de sinal.
  - `PUT /sinais/:id`: Atualiza um sinal (ex: para aprovação).
  - `DELETE /sinais/:id`: Deleta um sinal.

---

### 🚀 Como Executar

O backend é gerenciado pelo arquivo `docker-compose.yml` na raiz do projeto. Ele é iniciado automaticamente junto com os outros serviços.

Para executar comandos específicos (como migrações), use o `docker-compose exec` a partir da raiz do projeto:
```bash
sudo docker-compose exec api npx prisma migrate dev
```