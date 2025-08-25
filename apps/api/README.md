# Backend da API - LIBRAS-EDU

Este diretório contém a API backend do projeto LIBRAS-EDU. É uma API RESTful construída com Node.js e Express, responsável por toda a lógica de negócios, gestão de dados e comunicação com o banco de dados PostgreSQL.

A arquitetura do projeto segue um padrão **MVC com uma camada de Serviços** (`Rotas` -> `Controladores` -> `Serviços` -> `Modelo`), o que garante um código organizado, desacoplado e escalável.

---

### ✨ Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Ambiente de execução JavaScript. |
| **Framework** | Express.js | Framework para a construção da API. |
| **Banco de Dados** | PostgreSQL | Banco de dados relacional para armazenamento dos dados. |
| **ORM** | Prisma | Ferramenta para acesso e migração do banco de dados. |
| **Containerização** | Docker | Garante um ambiente de desenvolvimento e produção consistente. |

---

### 📂 Estrutura de Pastas

- **/prisma**: Contém o `schema.prisma` que define o modelo de dados e as migrações.
- **/src/routes**: Mapeia os endpoints da API para os métodos dos controladores.
- **/src/controllers**: Recebem as requisições HTTP e orquestram o fluxo, chamando a camada de serviço.
- **/src/services**: Contêm toda a lógica de negócio da aplicação.
- **/generated/prisma**: Contém o Prisma Client gerado automaticamente.
- **server.js**: Ponto de entrada da aplicação, onde o servidor Express é configurado.

---

### 🔌 Endpoints da API (Principais)

A API base roda em `http://localhost:3000/api`.

- **Recursos de Usuários e Instituições:**
  - `GET, POST /users`
  - `GET, POST /instituicoes`

- **Recursos Acadêmicos:**
  - `GET, POST /areas-conhecimento`
  - `GET, POST /cursos`
  - `GET, POST /disciplinas`

- **Recursos Principais (Sinais):**
  - `GET, POST /sinais-propostos` (Para submissão de novos sinais)
  - `GET, POST /sinais` (Para os sinais já aprovados no glossário)

---

### 🚀 Como Executar

O backend é gerido pelo ficheiro `docker-compose.yml` na raiz do projeto. Consulte o `README.md` principal para as instruções completas de como iniciar todo o ambiente.

Para executar comandos específicos (como migrações), use `docker-compose exec`:
```bash
sudo docker-compose exec api npx prisma migrate dev