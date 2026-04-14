# Frontend - LIBRAS-EDU

Este diretório contém a aplicação frontend do projeto LIBRAS-EDU. É uma Single Page Application (SPA) construída com React e Vite, responsável por apresentar a interface de utilizador e consumir os dados da API backend.

A aplicação inclui áreas públicas, um painel de administração completo, um painel dedicado para avaliadores e funcionalidades para que utilizadores autenticados possam contribuir com o glossário.

---

### ✨ Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Biblioteca UI**| React | Biblioteca para a construção de interfaces de utilizador. |
| **Build Tool** | Vite | Ferramenta de desenvolvimento e build de alta performance. |
| **Roteamento** | React Router DOM | Para a navegação e gestão de múltiplas páginas na aplicação. |
| **Estilização** | Tailwind CSS | Framework CSS utility-first para designs customizados. |
| **Gráficos** | Chart.js | Biblioteca para a criação de gráficos dinâmicos no dashboard. |
| **Ícones** | Lucide React & React Icons | Bibliotecas para ícones SVG consistentes e performáticos. |
| **Cliente HTTP**| Axios | Biblioteca para fazer requisições à API backend. |
| **Containerização**| Docker | Garante um ambiente de desenvolvimento consistente. |

---

### 📂 Estrutura de Pastas

- **/src/pages**: Contém os componentes de página principais da aplicação.
  - `HomePage.jsx`, `LoginPage.jsx`, `RegisterPage.jsx`: Páginas públicas iniciais.
  - `SubmitSignPage.jsx`: Página com o formulário para utilizadores logados proporem novos sinais.
  - `AdminDashboardPage.jsx`: Painel principal do administrador, com estatísticas e gráficos.
  - `AdminUsersPage.jsx`, `AdminEvaluatorsPage.jsx`: Páginas para a gestão de utilizadores e avaliadores.
  - `AdminSinaisPage.jsx`: Página para o administrador consultar os sinais propostos e oficiais.
  - `EvaluatorDashboardPage.jsx`: Painel principal do avaliador, com a lista de propostas pendentes.
  - `ApprovedProposalsPage.jsx`, `RejectedProposalsPage.jsx`: Páginas para o avaliador consultar o seu histórico.

- **/src/layouts**: Contém os componentes de layout que envolvem as páginas.
  - `MainLayout.jsx`: Layout principal para as páginas públicas (com `Navbar` e `Footer`).
  - `AdminLayout.jsx`: Layout dedicado ao painel de administração, com barra lateral e superior responsivas.
  - `EvaluatorLayout.jsx`: Layout dedicado ao painel do avaliador.

- **/src/components**: Contém componentes React reutilizáveis.
  - `NavBar.jsx`, `Footer.jsx`, `Button.jsx`: Componentes de UI genéricos.
  - `ProtectedRoute.jsx`: Componente de alta ordem que protege as rotas, contendo a lógica para `ProtectedRoute` (admin), `EvaluatorRoute` (avaliador) e `AuthenticatedRoute` (qualquer utilizador logado).
  - `EvaluationModal.jsx`: Modal utilizado pelo avaliador para aprovar ou recusar uma proposta de sinal.
  - `EvaluatorFormModal.jsx`: Modal utilizado pelo administrador para criar e editar avaliadores.

- **/src/context**: Contém os Contextos do React para gestão de estado global.
  - `AuthContext.jsx`: Centraliza toda a lógica de autenticação, incluindo o estado do utilizador, o token e as funções de `login` e `logout`. Também gere o redirecionamento baseado no perfil do utilizador.

- **/src/api**: Contém configurações centralizadas da API.
  - `axiosConfig.js`: Configura a instância do Axios, adicionando um intercetor que anexa automaticamente o token de autenticação a todas as requisições.

- **/src/assets**: Contém imagens, logos e outros recursos estáticos.

---

### 🚀 Como Executar

O frontend é gerido pelo ficheiro `docker-compose.yml` na raiz do projeto e fica acessível em **`http://localhost:5173`**.

Consulte o `README.md` principal do repositório para as instruções completas de como iniciar todo o ambiente full-stack.