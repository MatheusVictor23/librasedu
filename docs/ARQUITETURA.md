# Arquitetura

## Visão geral

O LIBRAS-EDU é composto por uma SPA React, uma API REST Express e um banco
PostgreSQL. O Prisma realiza o mapeamento e o acesso aos dados.

Fluxo principal:

```text
Navegador
   |
   | HTTP/JSON e multipart/form-data
   v
Frontend React/Vite :5173
   |
   | API REST /api
   v
Backend Express :3000 ----> uploads persistentes
   |
   | Prisma
   v
PostgreSQL :5432
```

## Componentes

| Componente | Responsabilidade |
|---|---|
| `apps/web/src/pages` | Páginas públicas e painéis por perfil. |
| `apps/web/src/components` | Componentes visuais e formulários reutilizáveis. |
| `apps/web/src/context/AuthContext.jsx` | Sessão do usuário no frontend. |
| `apps/web/src/api/axiosConfig.js` | Cliente HTTP autenticado. |
| `apps/api/server.js` | Configuração do Express, CORS, rotas e arquivos estáticos. |
| `apps/api/src/routes` | Endpoints e composição dos middlewares. |
| `apps/api/src/controllers` | Tradução entre HTTP e casos de uso. |
| `apps/api/src/services` | Regras e operações de negócio. |
| `apps/api/src/middlewares` | Autenticação, autorização e uploads. |
| `apps/api/src/prismaClient.js` | Instância compartilhada do Prisma Client. |
| `apps/api/prisma/schema.prisma` | Modelo de dados. |
| `apps/api/prisma/migrations` | Evolução versionada do banco. |

## Perfis e autorização

| Perfil | Capacidades principais |
|---|---|
| `USER` | Manter o perfil, interagir com sinais e propor sinais quando possuir vínculo. |
| `AVALIADOR` | Consultar e avaliar propostas, além das capacidades autenticadas permitidas. |
| `ADMIN` | Administrar usuários, catálogos, solicitações, propostas e publicações. |

A API assina um JWT no login. Rotas protegidas validam o token e carregam o
usuário atual. Middlewares adicionais verificam perfil administrativo,
avaliador ou vínculo institucional.

## Fluxo de uma proposta

1. o usuário cria ou acessa sua conta;
2. solicita ou recebe vínculo com uma instituição;
3. envia dados e vídeo de uma proposta;
4. o arquivo é persistido em `uploads` e a proposta fica `PENDENTE`;
5. um avaliador define `APROVADO` ou `REJEITADO` e pode comentar;
6. um administrador publica uma proposta aprovada;
7. o sinal oficial passa a aceitar consulta e interações.

## Modelo de dados

Entidades principais:

- `Usuario` e `Instituicao` representam identidade e vínculo institucional;
- `AreaConhecimento`, `Curso` e `Disciplina` organizam o catálogo acadêmico;
- `SinalProposto` registra submissão e avaliação;
- `Sinal` representa uma publicação oficial;
- `SinalSalvo`, `SinalCurtido` e `Comentario` registram interações;
- `SolicitacaoInstituicao` e `SolicitacaoVinculo` sustentam a moderação
  administrativa.

O schema completo e as relações são a fonte de verdade em
`apps/api/prisma/schema.prisma`.

## Persistência de arquivos

O Multer recebe vídeos, documentos e avatares. A API serve os arquivos pelo
prefixo `/uploads`. No Compose, `uploads_data` mantém os arquivos entre
reinicializações; `postgres_data` mantém o banco.

## Restrições atuais

- frontend e API não possuem configuração de produção;
- a URL da API está fixa como `http://localhost:3000` no frontend;
- a chave JWT está fixa no backend;
- o Compose não possui healthchecks;
- `depends_on` ordena a inicialização, mas não confirma que o banco está pronto;
- migrations e dados iniciais não são automatizados;
- não existem testes automatizados ou pipeline de CI versionado.

