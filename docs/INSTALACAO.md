# Instalação e execução

## Pré-requisitos

- Git;
- Docker Engine;
- Docker Compose V2.

Confirme o ambiente:

```bash
git --version
docker --version
docker compose version
```

## Instalação com Docker

```bash
git clone https://github.com/MatheusVictor23/librasedu.git
cd librasedu
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
docker compose ps
```

O Compose cria os seguintes serviços:

| Serviço | Porta local | Responsabilidade |
|---|---:|---|
| `web` | 5173 | Servidor Vite e interface React. |
| `api` | 3000 | API REST Express. |
| `postgres` | 5432 | Banco PostgreSQL. |

A porta `5555` também está exposta pelo serviço da API para uso eventual do
Prisma Studio.

## Preparação do banco

Em uma máquina nova, execute as migrations antes de usar o sistema:

```bash
docker compose exec api npx prisma migrate deploy
```

Para desenvolvimento de novas migrations, use `migrate dev` conscientemente:

```bash
docker compose exec api npx prisma migrate dev
```

`migrate deploy` aplica migrations existentes e é a opção adequada para
reproduzir o schema versionado. `migrate dev` também detecta alterações no
schema e pode criar uma nova migration.

O repositório não contém seed. Uma base criada do zero não terá usuários,
administradores, instituições, cursos, disciplinas ou sinais iniciais.

## Verificação da instalação

Confira os containers:

```bash
docker compose ps
```

Teste o frontend e duas rotas públicas que consultam o banco:

```bash
curl -i http://localhost:5173/
curl -i http://localhost:3000/api/public/stats
curl -i http://localhost:3000/api/public/ranking
```

Resultados esperados:

- frontend com HTTP `200`;
- indicadores públicos com HTTP `200` e JSON;
- `GET /api` retorna `404`, pois não existe uma rota raiz da API.

## Logs e encerramento

```bash
docker compose logs --tail=100 api
docker compose logs --tail=100 web
docker compose logs --tail=100 postgres
docker compose down
```

`docker compose down` preserva os volumes. O comando abaixo também remove o
banco e os uploads locais e, portanto, causa perda de dados:

```bash
docker compose down -v
```

## Persistência

| Volume | Conteúdo |
|---|---|
| `postgres_data` | Arquivos do PostgreSQL. |
| `uploads_data` | Vídeos, documentos e avatares enviados. |

Os volumes são locais à instalação Docker. Copiar apenas o repositório não
transfere os dados nem os uploads de outra máquina.

## Execução sem Docker

Esse modo exige Node.js 18 ou compatível, npm e PostgreSQL acessível.

Backend:

```bash
cd apps/api
npm ci
export DATABASE_URL="postgresql://librasedu_user:librasedu_pass@localhost:5432/librasedu"
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Frontend, em outro terminal:

```bash
cd apps/web
npm ci
npm run dev
```

## Problemas comuns

### A API inicia, mas as consultas falham

Verifique o PostgreSQL e aplique as migrations:

```bash
docker compose ps
docker compose exec api npx prisma migrate deploy
docker compose logs --tail=100 api postgres
```

### Uma porta já está ocupada

Identifique o processo que utiliza `3000`, `5173` ou `5432`, ou altere o
mapeamento correspondente no Compose.

### O navegador não acessa a API a partir de outro computador

O frontend usa `localhost:3000` em pontos do código. Para acesso remoto ou
publicação, a URL precisa ser externalizada e apontar para o host da API.

### Permissão negada no socket do Docker

Configure o usuário conforme a documentação da instalação do Docker ou use o
método administrativo adotado pelo sistema operacional.

