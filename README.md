# LIBRAS-EDU (Tapiri)

Portal colaborativo para cadastro, avaliação, publicação e consulta de sinais
em Língua Brasileira de Sinais (Libras), com foco em termos técnicos ligados a
áreas de conhecimento, cursos e disciplinas.

## Visão geral

O sistema organiza um fluxo colaborativo em que:

1. visitantes consultam indicadores públicos e criam uma conta;
2. usuários autenticados consultam e interagem com sinais oficiais;
3. usuários com vínculo institucional submetem propostas de novos sinais;
4. avaliadores aprovam ou rejeitam as propostas;
5. administradores gerenciam o catálogo e publicam propostas aprovadas.

O repositório contém uma aplicação web React, uma API REST Express e um banco
PostgreSQL, executados localmente com Docker Compose.

## Funcionalidades

- autenticação JWT e controle de acesso por perfil;
- cadastro e atualização de usuários e avatares;
- vínculo institucional e solicitação de novas instituições;
- submissão e avaliação de propostas de sinais;
- publicação e consulta de sinais oficiais;
- curtidas, sinais salvos e comentários;
- painéis de usuário, avaliador e administrador;
- indicadores públicos, administrativos e rankings;
- upload persistente de vídeos, documentos e avatares.

## Arquitetura

| Camada | Tecnologias | Diretório |
|---|---|---|
| Frontend | React 18, Vite, Tailwind CSS e Axios | `apps/web` |
| Backend | Node.js 18, Express, Prisma e JWT | `apps/api` |
| Banco | PostgreSQL 14 | serviço `postgres` |
| Ambiente local | Docker e Docker Compose | `docker-compose.yml` |

O fluxo e as responsabilidades dos componentes estão descritos em
[`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).

## Início rápido

Pré-requisitos: Git, Docker e Docker Compose.

```bash
git clone https://github.com/MatheusVictor23/librasedu.git
cd librasedu
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
docker compose ps
```

A aplicação fica disponível em:

- frontend: <http://localhost:5173>;
- API: <http://localhost:3000/api>;
- uploads: <http://localhost:3000/uploads>.

Em uma instalação nova, a migração é obrigatória. O projeto ainda não possui
um seed de dados; portanto, o banco começa vazio.

Consulte o procedimento completo e a solução de problemas em
[`docs/INSTALACAO.md`](docs/INSTALACAO.md).

## Estrutura do projeto

```text
.
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── web/
│       ├── public/
│       ├── src/
│       ├── Dockerfile
│       └── package.json
├── docs/
├── docker-compose.yml
└── README.md
```

## Documentação

- [Índice da documentação](docs/README.md)
- [Instalação e execução](docs/INSTALACAO.md)
- [Arquitetura](docs/ARQUITETURA.md)
- [Referência da API](docs/API.md)
- [Desenvolvimento e operação](docs/DESENVOLVIMENTO.md)

## Estado atual e limitações conhecidas

- o fluxo Docker local está funcional;
- a build de produção do frontend é gerada com sucesso;
- não há suíte de testes automatizados;
- o script de lint do frontend precisa ser compatibilizado com o ESLint atual;
- as migrations não são executadas automaticamente ao subir os containers;
- não existe seed para criar dados ou usuário administrador;
- a URL da API e a chave JWT ainda estão fixas no código;
- a configuração atual é destinada ao desenvolvimento local, não à produção.
