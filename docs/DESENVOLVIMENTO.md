# Desenvolvimento e operação

## Comandos do frontend

```bash
cd apps/web
npm ci
npm run dev
npm run build
npm run lint
npm run preview
```

O build está funcional. No estado atual, `npm run lint` falha porque o script
usa a opção `--ext` junto de `eslint.config.js`; essa combinação não é aceita
pela versão instalada do ESLint.

## Comandos da API

```bash
cd apps/api
npm ci
npx prisma generate
npx prisma validate
npm run dev
npm run start
```

- `dev` inicia o Nodemon;
- `start` gera o Prisma Client e inicia `server.js`;
- `prisma validate` valida o schema, mas não testa conectividade nem regras de
  negócio.

## Comandos Docker

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f api
docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma studio
docker compose down
```

## Alterações no banco

Durante o desenvolvimento:

1. altere `apps/api/prisma/schema.prisma`;
2. crie uma migration no ambiente de desenvolvimento;
3. revise o SQL gerado;
4. versione o schema e a pasta da migration;
5. valide uma base limpa com `prisma migrate deploy`.

Exemplo:

```bash
docker compose exec api npx prisma migrate dev --name descricao_da_alteracao
```

Não edite uma migration já aplicada em ambientes compartilhados; crie uma
nova migration corretiva.

## Verificação manual mínima

Enquanto não existe uma suíte automatizada, valide antes de entregar:

1. `docker compose config --quiet`;
2. build do frontend;
3. geração e validação do Prisma Client;
4. containers ativos em `docker compose ps`;
5. HTTP 200 no frontend e nas rotas públicas;
6. cadastro e login de usuário;
7. fluxo afetado pela alteração;
8. logs da API e do PostgreSQL sem erros inesperados.

## Configuração e segurança

O Compose contém usuário e senha do PostgreSQL para desenvolvimento. A chave
JWT também está fixa no código. Antes de publicar o sistema:

- mover credenciais e segredo JWT para variáveis de ambiente;
- criar `.env.example` sem segredos reais;
- restringir CORS;
- configurar URL pública da API no frontend;
- executar frontend e API em modo de produção;
- adicionar proxy reverso e HTTPS;
- definir backups do banco e dos uploads;
- criar healthchecks e política de atualização;
- retirar portas internas desnecessárias da exposição pública.

## Débitos técnicos conhecidos

- corrigir o script de lint;
- adicionar testes de API, serviços e interface;
- automatizar migrations na implantação;
- definir seed ou bootstrap seguro do primeiro administrador;
- remover URLs `localhost` espalhadas pelo frontend;
- externalizar a chave JWT;
- adicionar endpoint de saúde;
- remover o campo obsoleto `version` do Compose;
- avaliar divisão do bundle principal do frontend;
- atualizar periodicamente os dados do Browserslist.

