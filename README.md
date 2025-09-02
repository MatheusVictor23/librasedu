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

## 📖 Sobre o Projeto

O **LIBRAS-EDU** é uma plataforma web colaborativa projetada para ser um glossário de termos técnicos em Língua Brasileira de Sinais (LIBRAS). O objetivo é centralizar, validar e difundir sinais para áreas de conhecimento específicas (como Informática), facilitando o aprendizado e a inclusão de estudantes surdos e servindo como ferramenta de apoio para intérpretes e educadores.

Este repositório contém o código-fonte de toda a aplicação, incluindo o frontend em React e o backend em Node.js.

---

## ✨ Funcionalidades Principais

* **API REST com Node.js e Express**: Backend robusto para gerenciar todos os dados da aplicação.
* **Interface Reativa com React**: Frontend moderno construído com React e Vite para uma experiência de usuário fluida.
* **Operações CRUD Completas**:
    * Gerenciamento de **Usuários**.
    * Gerenciamento de **Áreas de Conhecimento** (ex: Informática, Biologia).
    * Gerenciamento de **Propostas de Sinais**.
* **Banco de Dados com Prisma e PostgreSQL**: Persistência de dados relacional e um ORM moderno para acesso seguro aos dados.
* **Ambiente Totalmente Containerizado**: Com Docker e Docker Compose, a aplicação inteira (backend, frontend e banco de dados) é configurada e executada com um único comando, garantindo consistência entre diferentes ambientes de desenvolvimento.

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
| :--- | :--- |
| **Frontend** | React (com Vite), Axios |
| **Backend** | Node.js, Express.js |
| **Banco de Dados** | PostgreSQL, Prisma (ORM) |
| **Infraestrutura** | Docker, Docker Compose |

---

## 🚀 Como Executar o Projeto Completo

Este projeto é totalmente containerizado. Para executá-lo, você **não precisa** ter Node.js, NPM ou PostgreSQL instalados na sua máquina, apenas o Docker.

### Pré-requisitos
* **Git**
* **Docker** e **Docker Compose**

### 1. Clonar o Repositório
```bash
git clone -b dev https://github.com/MatheusVictor23/librasedu.git
cd librasedu
```

### 2. Iniciar a Aplicação
O comando a seguir irá construir as imagens do backend e frontend (se for a primeira vez) e iniciar todos os serviços em segundo plano.

```bash
sudo docker-compose up --build
```
* `--build`: Garante que as imagens Docker sejam construídas com o código mais recente.
* Você pode adicionar a flag `-d` (`sudo docker-compose up -d --build`) para rodar os containers em modo "detached" (em segundo plano).

### 3. Executar a Migração do Banco de Dados
Após iniciar os containers pela primeira vez, o banco de dados estará no ar, mas ainda vazio. Execute o comando abaixo em um **novo terminal** para que o Prisma crie todas as tabelas necessárias.

**Este passo só precisa ser feito uma vez.**

```bash
sudo docker-compose exec api npx prisma migrate dev --name init
```

## 3.1 Popular o banco

Para popular o banco de dados execute o seguinte comando:

```bash
docker compose exec api npm run seed
```

### 4. Acessar a Aplicação
Pronto! O ambiente completo está no ar.

* **Frontend (Aplicação Web):** [http://localhost:5173](http://localhost:5173)
* **Backend (API):** [http://localhost:3000/api](http://localhost:3000/api)

### Comandos Úteis do Docker
- **Verificar o status dos containers:** `sudo docker-compose ps`
- **Ver logs em tempo real (ex: da API):** `sudo docker-compose logs -f api`
- **Parar todos os serviços:** `sudo docker-compose down`

---
### 🔌 Endpoints Principais da API

A API base roda em `http://localhost:3000/api`.

* `/users` (GET, POST, PUT, DELETE)
* `/areas` (GET, POST, PUT, DELETE)
* `/sinais` (GET, POST, PUT, DELETE)