# Referência da API

## Convenções

- URL-base local: `http://localhost:3000/api`;
- conteúdo padrão: JSON;
- uploads: `multipart/form-data`;
- autenticação: `Authorization: Bearer <token>`.

## Autenticação e usuários

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | Público | Autentica e retorna usuário e JWT. |
| `POST` | `/users` | Público | Cria uma conta; aceita avatar. |
| `GET` | `/users/me` | Autenticado | Retorna o perfil atual. |
| `GET` | `/users/me/stats` | Autenticado | Retorna estatísticas pessoais. |
| `GET` | `/users/me/saved` | Autenticado | Lista sinais salvos. |
| `GET` | `/users/me/liked` | Autenticado | Lista sinais curtidos. |
| `GET` | `/users/me/proposals` | Autenticado | Lista propostas enviadas. |
| `PUT` | `/users/profile` | Autenticado | Atualiza perfil e avatar. |

Também existem rotas administrativas legadas em `/users` e `/users/:id`,
protegidas por autenticação e perfil `ADMIN`.

## Catálogo acadêmico

| Método | Rota | Descrição |
|---|---|---|
| `GET`, `POST` | `/instituicoes` | Lista ou cria instituições. |
| `GET`, `POST` | `/areas-conhecimento` | Lista ou cria áreas. |
| `GET`, `POST` | `/cursos` | Lista ou cria cursos. |
| `GET`, `POST` | `/disciplinas` | Lista ou cria disciplinas. |

## Sinais e propostas

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/sinais` | Autenticado | Lista sinais oficiais. |
| `POST` | `/sinais` | Autenticado | Cria um sinal oficial. |
| `GET` | `/sinais/trending` | Autenticado | Lista sinais em destaque. |
| `GET` | `/sinais/recent` | Autenticado | Lista sinais recentes. |
| `GET` | `/sinais/recommended` | Autenticado | Lista recomendações pessoais. |
| `GET` | `/sinais/:id` | Autenticado | Detalha um sinal. |
| `POST`, `DELETE` | `/sinais/:id/like` | Autenticado | Adiciona ou remove curtida. |
| `POST`, `DELETE` | `/sinais/:id/save` | Autenticado | Salva ou remove um sinal. |
| `GET`, `POST` | `/sinais/:id/comentarios` | Autenticado | Lista ou cria comentários. |
| `GET` | `/recomendados/:disciplinaId/:sinalIdAtual` | Público | Lista sinais relacionados. |
| `GET` | `/sinais-propostos` | Público | Lista propostas. |
| `POST` | `/sinais-propostos` | Vinculado | Envia proposta e vídeo. |
| `GET` | `/sinais-propostos/:id` | Autenticado | Detalha uma proposta. |

## Solicitações

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/solicitacoes/vinculo` | Autenticado | Solicita vínculo institucional. |
| `POST` | `/solicitacoes/instituicao` | Autenticado | Solicita uma nova instituição. |

Campos de arquivos:

- vínculo: `documento`;
- nova instituição: `docUsuario` e `docRepresentante`.

## Avaliação

As rotas exigem perfil `AVALIADOR` ou `ADMIN`.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/evaluator/proposals/pending` | Lista propostas pendentes. |
| `GET` | `/evaluator/proposals/:status` | Filtra por `aprovado` ou `rejeitado`. |
| `POST` | `/evaluator/proposals/:id/evaluate` | Avalia uma proposta. |

Na avaliação, `status` deve ser `APROVADO` ou `REJEITADO`; `comentarios` é o
texto opcional do avaliador.

## Administração

Todas as rotas abaixo usam o prefixo `/admin` e exigem perfil `ADMIN`.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/stats` | Indicadores administrativos. |
| `GET` | `/recent-users` | Usuários recentes. |
| `GET` | `/proposals-by-day` | Propostas agrupadas por dia. |
| `GET` | `/users-by-role` | Usuários agrupados por perfil. |
| `GET`, `POST` | `/users` | Lista ou cria usuários. |
| `GET`, `PUT`, `DELETE` | `/users/:id` | Consulta, atualiza ou remove usuário. |
| `GET`, `POST` | `/evaluators` | Lista ou cria avaliadores. |
| `GET` | `/disciplinas` | Lista disciplinas administrativas. |
| `POST` | `/disciplinas/:id/manage` | Aprova ou combina uma disciplina. |
| `GET`, `POST` | `/instituicoes` | Lista ou cria instituições. |
| `PUT`, `DELETE` | `/instituicoes/:id` | Atualiza ou remove instituição. |
| `GET` | `/sinais-propostos` | Lista propostas. |
| `GET` | `/sinais-oficiais` | Lista sinais oficiais. |
| `GET` | `/proposals/approved-unpublished` | Lista aprovadas não publicadas. |
| `POST` | `/proposals/:id/publish` | Publica uma proposta aprovada. |
| `GET` | `/solicitacoes/pendentes` | Lista solicitações pendentes. |
| `POST` | `/solicitacoes/vinculo/:id/manage` | Decide solicitação de vínculo. |
| `POST` | `/solicitacoes/instituicao/:id/manage` | Decide solicitação de instituição. |

## Indicadores públicos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/public/stats` | Estatísticas públicas. |
| `GET` | `/public/ranking` | Ranking de colaboradores. |

## Uploads

| Tipo | Formatos aceitos | Limite |
|---|---|---:|
| Vídeo de proposta | MP4, QuickTime e WebM | 50 MB |
| Documento | JPEG, PNG e PDF | 10 MB |
| Avatar | JPEG, PNG e GIF | 5 MB |

Os caminhos gravados no banco são servidos pela API em
`http://localhost:3000/uploads/...`.

