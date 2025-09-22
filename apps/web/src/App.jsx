// apps/web/src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Importação das Páginas Públicas
import HomePage from './pages/HomePage'; // ATUALIZADO
import RegisterPageWrapper from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

// Importação da Página do Dashboard do Usuário
import UserDashboardPage from './pages/UserDashboardPage'; // ATUALIZADO
import SignsPage from './pages/SignsPage'; 
import ProfilePage from './pages/ProfilePage';

// Importação das Páginas do Painel de Administração
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminEvaluatorsPage from './pages/AdminEvaluatorsPage';
import AdminSinaisPage from './pages/AdminSinaisPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ApprovedProposalsPage from './pages/ApprovedProposalsPage';
import RejectedProposalsPage from './pages/RejectedProposalsPage';
import SubmitSignPage from './pages/SubmitSignPage';

// Importação da Página do Painel do Avaliador
import EvaluatorDashboardPage from './pages/EvaluatorDashboardPage';

// Importação dos Componentes de Proteção de Rotas
import { ProtectedRoute, EvaluatorRoute, AuthenticatedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* --- Rotas Públicas --- */}
      <Route path='/' element={<HomePage />} /> {/* ATUALIZADO */}
      <Route path='/register' element={<RegisterPageWrapper />} />
      <Route path='/login' element={<LoginPage />} />
      
      {/* --- Rotas do Usuário Autenticado --- */}
      <Route path='/dashboard' element={<AuthenticatedRoute><UserDashboardPage /></AuthenticatedRoute>} /> {/* ATUALIZADO */}
      <Route path="/propor-sinal" element={<AuthenticatedRoute><SubmitSignPage /></AuthenticatedRoute>} />
      <Route path="/sinais" element={<AuthenticatedRoute><SignsPage /></AuthenticatedRoute>} /> {/* 2. Adicione a nova rota aqui */}
      <Route path="/perfil" element={<AuthenticatedRoute><ProfilePage /></AuthenticatedRoute>} />


      {/* --- Rotas de Administração Protegidas --- */}
      <Route path='/admin' element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
      <Route path='/admin/users' element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
      <Route path='/admin/evaluators' element={<ProtectedRoute><AdminEvaluatorsPage /></ProtectedRoute>} />
      <Route path='/admin/sinais' element={<ProtectedRoute><AdminSinaisPage /></ProtectedRoute>} />
      <Route path='/admin/settings' element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />

      {/* --- Rota do Avaliador Protegida --- */}
      <Route path='/evaluator/dashboard' element={<EvaluatorRoute><EvaluatorDashboardPage /></EvaluatorRoute>} />
      <Route path='/evaluator/approved' element={<EvaluatorRoute><ApprovedProposalsPage /></EvaluatorRoute>} />
      <Route path='/evaluator/rejected' element={<EvaluatorRoute><RejectedProposalsPage /></EvaluatorRoute>} />
      
    </Routes>
  );
}

export default App;