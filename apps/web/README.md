# Frontend - LIBRAS-EDU

Este diretório contém a aplicação frontend do projeto LIBRAS-EDU. É uma Single Page Application (SPA) construída com React e Vite, responsável por apresentar a interface de usuário e consumir os dados da API backend.

---

### ✨ Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Biblioteca UI**| React | Biblioteca para a construção de interfaces de usuário. |
| **Build Tool** | Vite | Ferramenta de desenvolvimento e build de alta performance. |
| **Cliente HTTP**| Axios | Biblioteca para fazer requisições à API backend. |
| **Containerização**| Docker | Garante um ambiente de desenvolvimento consistente. |

---

### 📂 Estrutura de Pastas

- **/src/components**: Contém componentes React reutilizáveis (ex: `Card.jsx`).
- **/src/App.jsx**: Componente principal da aplicação, onde a lógica principal reside.
- **/src/main.jsx**: Ponto de entrada da aplicação React, onde ela é montada no DOM.
- **index.html**: O arquivo HTML base da aplicação.
- **Dockerfile**: Receita para construir a imagem Docker do ambiente de desenvolvimento do frontend.

---

### 🚀 Como Executar

O frontend é gerenciado pelo arquivo `docker-compose.yml` na raiz do projeto. Ele é iniciado automaticamente junto com os outros serviços e fica acessível em **`http://localhost:5173`**.

O servidor de desenvolvimento do Vite possui hot-reloading, então qualquer alteração nos arquivos do frontend será refletida instantaneamente no navegador.