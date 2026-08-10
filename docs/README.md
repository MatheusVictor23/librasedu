# Documentação do LIBRAS-EDU

Este diretório concentra a documentação técnica e operacional do projeto.

## Conteúdo

| Documento | Finalidade |
|---|---|
| [INSTALACAO.md](INSTALACAO.md) | Preparar uma máquina nova, iniciar os serviços e diagnosticar falhas. |
| [ARQUITETURA.md](ARQUITETURA.md) | Explicar componentes, responsabilidades, dados e fluxos principais. |
| [API.md](API.md) | Registrar autenticação, perfis, uploads e endpoints REST. |
| [DESENVOLVIMENTO.md](DESENVOLVIMENTO.md) | Reunir comandos de manutenção, verificações e limitações atuais. |

## Convenções

- comandos são executados a partir da raiz, salvo indicação contrária;
- exemplos usam Docker Compose V2 (`docker compose`);
- a URL-base da API local é `http://localhost:3000/api`;
- rotas protegidas recebem `Authorization: Bearer <token>`;
- credenciais presentes no Compose são exclusivamente para desenvolvimento.

## Documentos futuros

Quando o processo estiver estabilizado, podem ser acrescentados:

- diagrama visual da arquitetura e implantação;
- modelo de entidade-relacionamento;
- guia de publicação em produção;
- decisões arquiteturais (ADRs);
- estratégia de testes e qualidade.

