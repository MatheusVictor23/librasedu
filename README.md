# Portal Colaborativo LIBRAS-EDU



<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

## Sobre o Projeto

O **LIBRAS-EDU** é uma plataforma web para cadastro, avaliação, publicação e consulta de sinais em Língua Brasileira de Sinais (Libras), com foco em termos técnicos vinculados a áreas de conhecimento, cursos e disciplinas.

O projeto organiza um fluxo colaborativo em que usuários autenticados podem consultar sinais oficiais, interagir com o acervo e submeter propostas de novos sinais. As propostas passam por avaliação antes de serem disponibilizadas como sinais oficiais. A aplicação também possui painéis específicos para administração e avaliação, com controle de perfis e vínculo institucional.

Este repositório contém a aplicação completa:

- `apps/web`: frontend em React com Vite.
- `apps/api`: API REST em Node.js e Express.
- `docker-compose.yml`: orquestração local do frontend, backend e banco de dados PostgreSQL.

## Funcionalidades

- Autenticação com JWT e controle de acesso por perfil (`USER`, `AVALIADOR` e `ADMIN`).
- Cadastro e atualização de usuários, incluindo avatar.
- Solicitação de vínculo institucional e solicitação de cadastro de novas instituições.
- Submissão de propostas de sinais por usuários com vínculo institucional aprovado.
- Upload de vídeos para propostas de sinais, documentos comprobatórios e avatares.
- Avaliação de propostas por avaliadores, com aprovação, rejeição e comentários.
- Publicação de propostas aprovadas como sinais oficiais pelo administrador.
- Consulta de sinais oficiais, sinais recentes, sinais em destaque e recomendações.
- Interações com sinais oficiais: curtidas, salvamentos e comentários.
- Painel do usuário com estatísticas, propostas enviadas, sinais salvos e sinais curtidos.
- Painel do avaliador para propostas pendentes, aprovadas e rejeitadas.
- Painel administrativo para usuários, avaliadores, instituições, disciplinas, propostas, sinais oficiais e solicitações pendentes.
- Indicadores públicos e administrativos para dashboards e rankings.

## Tecnologias

| Camada | Tecnologias |
| :--- | :--- |
| Frontend | React 18, Vite, React Router DOM, Axios, Tailwind CSS, Chart.js, Lucide React, React Icons |
| Backend | Node.js 18, Express, Prisma, JWT, BcryptJS, Multer |
| Banco de dados | PostgreSQL 14 |
| Infraestrutura local | Docker, Docker Compose |

## Arquitetura do Repositório

```text
.
|-- apps
|   |-- api
|   |   |-- prisma
|   |   |   |-- schema.prisma
|   |   |   `-- migrations
|   |   |-- src
|   |   |   |-- controllers
|   |   |   |-- middlewares
|   |   |   |-- routes
|   |   |   `-- services
|   |   |-- Dockerfile
|   |   `-- package.json
|   `-- web
|       |-- src
|       |   |-- api
|       |   |-- assets
|       |   |-- components
|       |   |-- context
|       |   |-- layouts
|       |   `-- pages
|       |-- Dockerfile
|       `-- package.json
|-- docker-compose.yml
`-- README.md
```

A API segue uma separação por camadas: rotas, middlewares, controladores, serviços e persistência via Prisma. O frontend é uma SPA com rotas públicas, rotas autenticadas, rotas de administrador e rotas de avaliador.

## Modelo de Dados

O schema Prisma define os principais recursos da aplicação:

- `Usuario`: usuários da plataforma, com perfil, dados de autenticação, avatar e vínculo opcional com instituição.
- `Instituicao`: instituições cadastradas e associadas a usuários.
- `AreaConhecimento`, `Curso` e `Disciplina`: estrutura acadêmica usada para classificar sinais e propostas.
- `SinalProposto`: propostas enviadas por usuários e avaliadas por avaliadores.
- `Sinal`: sinais oficiais publicados a partir de propostas aprovadas.
- `SinalSalvo`, `SinalCurtido` e `Comentario`: interações dos usuários com sinais oficiais.
- `SolicitacaoInstituicao` e `SolicitacaoVinculo`: solicitações administrativas relacionadas a instituições.

## Como Executar com Docker

### Pré-requisitos

- Git
- Docker
- Docker Compose

### 1. Clonar o Repositório

```bash
git clone -b dev https://github.com/MatheusVictor23/librasedu.git
cd librasedu
```

### 2. Subir os Serviços

```bash
sudo docker-compose up --build
```

Para executar em segundo plano:

```bash
sudo docker-compose up -d --build
```

O Compose inicia três serviços:

- `postgres`: banco PostgreSQL em `localhost:5432`.
- `api`: backend Express em `localhost:3000`.
- `web`: frontend Vite em `localhost:5173`.

### 3. Aplicar as Migrações

Com os containers em execução, aplique as migrações do Prisma:

```bash
sudo docker-compose exec api npx prisma migrate dev
```

Esse comando cria ou atualiza as tabelas no banco configurado pelo serviço `postgres`. O Prisma Client também é gerado automaticamente quando a API inicia via script `npm run start`.

### 4. Acessar a Aplicação

- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3000/api](http://localhost:3000/api)
- Arquivos enviados pela API: [http://localhost:3000/uploads](http://localhost:3000/uploads)

## Comandos Úteis

```bash
# Ver containers em execução
sudo docker-compose ps

# Acompanhar logs da API
sudo docker-compose logs -f api

# Acompanhar logs do frontend
sudo docker-compose logs -f web

# Acessar o container da API
sudo docker-compose exec api sh

# Executar migrações do Prisma
sudo docker-compose exec api npx prisma migrate dev

# Abrir o Prisma Studio
sudo docker-compose exec api npx prisma studio

# Parar os serviços
sudo docker-compose down

# Parar os serviços e remover volumes locais
sudo docker-compose down -v
```

Em instalações com Docker Compose V2, os mesmos comandos podem ser executados substituindo `docker-compose` por `docker compose`.

## Execução sem Docker

O fluxo recomendado para desenvolvimento é via Docker Compose, porque o repositório já inclui banco, API e frontend containerizados. Para execução manual, é necessário ter Node.js, npm e PostgreSQL instalados localmente.

### Backend

```bash
cd apps/api
npm install
export DATABASE_URL="postgresql://librasedu_user:librasedu_pass@localhost:5432/librasedu"
npx prisma generate
npx prisma migrate dev
npm run dev
```

A variável `DATABASE_URL` deve apontar para um banco PostgreSQL válido. Ao executar a API diretamente na máquina, ajuste o host conforme o seu ambiente local. Um exemplo usando o banco exposto pelo Docker em `localhost:5432`:

```text
postgresql://librasedu_user:librasedu_pass@localhost:5432/librasedu
```

No ambiente interno do Docker Compose, o valor usado pela API é:

```text
postgresql://librasedu_user:librasedu_pass@postgres:5432/librasedu
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

O frontend consome a API em `http://localhost:3000/api`, conforme definido em `apps/web/src/api/axiosConfig.js`.

## Scripts Disponíveis

### API

```bash
cd apps/api
npm run dev
npm run start
```

- `npm run dev`: executa a API com `nodemon`.
- `npm run start`: executa `prisma generate` e inicia o servidor com Node.js.

### Web

```bash
cd apps/web
npm run dev
npm run build
npm run lint
npm run preview
```

- `npm run dev`: inicia o servidor de desenvolvimento do Vite.
- `npm run build`: gera a build de produção.
- `npm run lint`: executa o ESLint.
- `npm run preview`: serve localmente a build gerada.

## API

A API é servida em `http://localhost:3000/api`. Rotas protegidas esperam o cabeçalho:

```http
Authorization: Bearer <token>
```

### Autenticação

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| POST | `/auth/login` | Autentica um usuário e retorna token JWT. |

### Usuários

| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| POST | `/users` | Público | Cria um usuário. |
| GET | `/users/me` | Autenticado | Retorna o perfil do usuário logado. |
| GET | `/users/me/stats` | Autenticado | Retorna estatísticas do usuário logado. |
| GET | `/users/me/saved` | Autenticado | Lista sinais salvos pelo usuário. |
| GET | `/users/me/liked` | Autenticado | Lista sinais curtidos pelo usuário. |
| GET | `/users/me/proposals` | Autenticado | Lista propostas enviadas pelo usuário. |
| PUT | `/users/profile` | Autenticado | Atualiza o perfil do usuário logado. |

### Catálogos Acadêmicos e Instituições

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/instituicoes` | Lista instituições. |
| POST | `/instituicoes` | Cria uma instituição. |
| GET | `/areas-conhecimento` | Lista áreas de conhecimento. |
| POST | `/areas-conhecimento` | Cria uma área de conhecimento. |
| GET | `/cursos` | Lista cursos. |
| POST | `/cursos` | Cria um curso. |
| GET | `/disciplinas` | Lista disciplinas. |
| POST | `/disciplinas` | Cria uma disciplina. |

### Sinais e Propostas

| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| GET | `/sinais` | Autenticado | Lista sinais oficiais. |
| POST | `/sinais` | Autenticado | Cria um sinal oficial. |
| GET | `/sinais/trending` | Autenticado | Lista sinais em destaque. |
| GET | `/sinais/recent` | Autenticado | Lista sinais recentes. |
| GET | `/sinais/recommended` | Autenticado | Lista sinais recomendados ao usuário. |
| GET | `/sinais/:id` | Autenticado | Detalha um sinal oficial. |
| POST | `/sinais/:id/like` | Autenticado | Curte um sinal. |
| DELETE | `/sinais/:id/like` | Autenticado | Remove curtida de um sinal. |
| POST | `/sinais/:id/save` | Autenticado | Salva um sinal. |
| DELETE | `/sinais/:id/save` | Autenticado | Remove um sinal dos salvos. |
| GET | `/sinais/:id/comentarios` | Autenticado | Lista comentários de um sinal. |
| POST | `/sinais/:id/comentarios` | Autenticado | Adiciona comentário a um sinal. |
| GET | `/recomendados/:disciplinaId/:sinalIdAtual` | Público | Lista recomendações relacionadas. |
| GET | `/sinais-propostos` | Público | Lista propostas de sinais. |
| POST | `/sinais-propostos` | Usuário com vínculo institucional | Envia uma proposta com vídeo. |
| GET | `/sinais-propostos/:id` | Autenticado | Detalha uma proposta. |

### Solicitações

| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| POST | `/solicitacoes/vinculo` | Autenticado | Solicita vínculo com uma instituição existente. |
| POST | `/solicitacoes/instituicao` | Autenticado | Solicita o cadastro de uma nova instituição. |

### Avaliador

As rotas de avaliador exigem perfil `AVALIADOR` ou `ADMIN`.

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/evaluator/proposals/pending` | Lista propostas pendentes. |
| GET | `/evaluator/proposals/:status` | Lista propostas por status. |
| POST | `/evaluator/proposals/:id/evaluate` | Avalia uma proposta. |

Em `/evaluator/proposals/:status`, os valores aceitos são `aprovado` e `rejeitado`. Ao avaliar uma proposta, o corpo da requisição deve informar `status` como `APROVADO` ou `REJEITADO`.

### Administração

As rotas administrativas exigem perfil `ADMIN` e são prefixadas por `/admin`.

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/admin/stats` | Retorna estatísticas do dashboard. |
| GET | `/admin/recent-users` | Lista usuários recentes. |
| GET | `/admin/proposals-by-day` | Retorna propostas agrupadas por dia. |
| GET | `/admin/users-by-role` | Retorna usuários agrupados por perfil. |
| GET | `/admin/users` | Lista usuários. |
| GET | `/admin/users/:id` | Detalha um usuário. |
| POST | `/admin/users` | Cria um usuário. |
| PUT | `/admin/users/:id` | Atualiza um usuário. |
| DELETE | `/admin/users/:id` | Remove um usuário. |
| GET | `/admin/evaluators` | Lista avaliadores. |
| POST | `/admin/evaluators` | Cria um avaliador. |
| GET | `/admin/disciplinas` | Lista disciplinas para administração. |
| POST | `/admin/disciplinas/:id/manage` | Gerencia aprovação ou combinação de disciplina. |
| GET | `/admin/instituicoes` | Lista instituições. |
| POST | `/admin/instituicoes` | Cria uma instituição. |
| PUT | `/admin/instituicoes/:id` | Atualiza uma instituição. |
| DELETE | `/admin/instituicoes/:id` | Remove uma instituição. |
| GET | `/admin/sinais-propostos` | Lista propostas. |
| GET | `/admin/sinais-oficiais` | Lista sinais oficiais. |
| GET | `/admin/proposals/approved-unpublished` | Lista propostas aprovadas ainda não publicadas. |
| POST | `/admin/proposals/:id/publish` | Publica uma proposta aprovada como sinal oficial. |
| GET | `/admin/solicitacoes/pendentes` | Lista solicitações pendentes. |
| POST | `/admin/solicitacoes/vinculo/:id/manage` | Aprova ou rejeita solicitação de vínculo. |
| POST | `/admin/solicitacoes/instituicao/:id/manage` | Aprova ou rejeita solicitação de instituição. |

Também existem rotas administrativas legadas sem o prefixo `/admin` para gerenciamento de usuários: `GET /users`, `GET /users/:id`, `PUT /users/:id` e `DELETE /users/:id`. Elas exigem autenticação e perfil `ADMIN`.

### Rotas Públicas de Indicadores

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/public/stats` | Retorna estatísticas públicas. |
| GET | `/public/ranking` | Retorna ranking público. |

## Uploads

A API usa `multer` para receber arquivos:

- Vídeos de propostas: `video/mp4`, `video/quicktime` e `video/webm`, até 50 MB.
- Documentos comprobatórios: `image/jpeg`, `image/png` e `application/pdf`, até 10 MB.
- Avatares: `image/jpeg`, `image/png` e `image/gif`, até 5 MB.

Os arquivos são gravados no diretório `uploads/` do backend e servidos pela rota `/uploads`.

## Observações de Desenvolvimento

- O `docker-compose.yml` define credenciais locais de desenvolvimento para o PostgreSQL. Não use essas credenciais em produção.
- A chave JWT está definida no middleware de autenticação da API. Para produção, ela deve ser externalizada para variável de ambiente.
- O volume `postgres_data` preserva os dados do banco entre reinicializações dos containers.
- O volume `uploads_data` preserva arquivos enviados pela aplicação no ambiente Docker.
