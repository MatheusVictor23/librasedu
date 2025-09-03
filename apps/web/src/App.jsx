// apps/web/src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Importação das Páginas Públicas
import HomePageWrapper from './pages/HomePage';
import RegisterPageWrapper from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

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
      <Route path='/' element={<HomePageWrapper />} />
      <Route path='/register' element={<RegisterPageWrapper />} />
      <Route path='/login' element={<LoginPage />} />
      

      {/* --- Rotas de Administração Protegidas --- */}
      {/* Apenas utilizadores com a role 'ADMIN' podem aceder a estas rotas */}
      <Route path='/admin' element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
      <Route path='/admin/users' element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
      <Route path='/admin/evaluators' element={<ProtectedRoute><AdminEvaluatorsPage /></ProtectedRoute>} />
      <Route path='/admin/sinais' element={<ProtectedRoute><AdminSinaisPage /></ProtectedRoute>} />
      <Route path='/admin/settings' element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />

      {/* --- Rota do Avaliador Protegida --- */}
      {/* Utilizadores com a role 'AVALIADOR' ou 'ADMIN' podem aceder a esta rota */}
      <Route path='/evaluator/dashboard' element={<EvaluatorRoute><EvaluatorDashboardPage /></EvaluatorRoute>} />
      <Route path='/evaluator/approved' element={<EvaluatorRoute><ApprovedProposalsPage /></EvaluatorRoute>} />
      <Route path='/evaluator/rejected' element={<EvaluatorRoute><RejectedProposalsPage /></EvaluatorRoute>} />
      <Route path="/propor-sinal" element={<AuthenticatedRoute><SubmitSignPage /></AuthenticatedRoute>} />
      
    </Routes>
  );
}

export default App;