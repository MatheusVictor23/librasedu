# Frontend - LIBRAS-EDU

Este diretório contém a aplicação frontend do projeto LIBRAS-EDU. É uma Single Page Application (SPA) construída com React e Vite, responsável por apresentar a interface de utilizador e consumir os dados da API backend.

---

### ✨ Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Biblioteca UI**| React | Biblioteca para a construção de interfaces de utilizador. |
| **Build Tool** | Vite | Ferramenta de desenvolvimento e build de alta performance. |
| **Roteamento** | React Router DOM | Para a navegação e gestão de múltiplas páginas na aplicação. |
| **Estilização** | Tailwind CSS | Framework CSS utility-first para designs customizados. |
| **Ícones** | Lucide React & React Icons | Bibliotecas para ícones SVG consistentes e performáticos. |
| **Cliente HTTP**| Axios | Biblioteca para fazer requisições à API backend. |
| **Containerização**| Docker | Garante um ambiente de desenvolvimento consistente. |

---

### 📂 Estrutura de Pastas

- **/src/pages**: Contém os componentes de página principais (ex: `HomePage.jsx`, `RegisterPage.jsx`).
- **/src/layouts**: Contém os componentes de layout que envolvem as páginas (ex: `MainLayout.jsx`).
- **/src/components**: Contém componentes React reutilizáveis (ex: `Button.jsx`, `Navbar.jsx`, `Footer.jsx`).
- **/src/context**: Contém os Contextos do React para gestão de estado global (ex: `AuthContext.jsx`).
- **/src/api**: Contém configurações centralizadas da API, como o `axiosConfig.js`.
- **/src/assets**: Contém imagens e outros recursos estáticos.
- **index.html**: O ficheiro HTML base da aplicação.
- **tailwind.config.js**: Ficheiro de configuração do Tailwind CSS.
- **Dockerfile**: Receita para construir a imagem Docker do ambiente de desenvolvimento.

---

### 🚀 Como Executar

O frontend é gerido pelo ficheiro `docker-compose.yml` na raiz do projeto e fica acessível em **`http://localhost:5173`**.

Consulte o `README.md` principal do repositório para as instruções completas de como iniciar todo o ambiente full-stack.