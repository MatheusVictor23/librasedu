import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Importação das Páginas Públicas
import HomePage from './pages/HomePage';
import RegisterPageWrapper from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

// Importação da Página do Dashboard do Usuário
import UserDashboardPage from './pages/UserDashboardPage';
import SignsPage from './pages/SignsPage'; 
import ProfilePage from './pages/ProfilePage';
import SignDetailPage from './pages/SignDetailPage';

// Importação das Páginas do Painel de Administração
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminEvaluatorsPage from './pages/AdminEvaluatorsPage';
import AdminSinaisPage from './pages/AdminSinaisPage';
import AdminInstitutionsPage from './pages/AdminInstitutionsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ApprovedProposalsPage from './pages/ApprovedProposalsPage';
import RejectedProposalsPage from './pages/RejectedProposalsPage';
import SubmitSignPage from './pages/SubmitSignPage';

// Importação da Página do Painel do Avaliador
import EvaluatorDashboardPage from './pages/EvaluatorDashboardPage';

// ATUALIZAÇÃO: Importar a nova rota protegida
import { ProtectedRoute, EvaluatorRoute, AuthenticatedRoute, ContributorRoute } from './components/ProtectedRoute';

// Componente para redirecionar usuários logados
const HomeRedirect = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <HomePage />;
};

function App() {
  return (
    <Routes>
      {/* --- Rotas Públicas --- */}
      <Route path='/' element={<HomeRedirect />} />
      <Route path='/register' element={<RegisterPageWrapper />} />
      <Route path='/login' element={<LoginPage />} />
      
      {/* --- Rotas do Usuário Autenticado --- */}
      <Route path='/dashboard' element={<AuthenticatedRoute><UserDashboardPage /></AuthenticatedRoute>} />
      
      {/* ATUALIZAÇÃO: A rota de submissão agora usa ContributorRoute */}
      <Route path="/propor-sinal" element={<ContributorRoute><SubmitSignPage /></ContributorRoute>} />

      <Route path="/sinais" element={<AuthenticatedRoute><SignsPage /></AuthenticatedRoute>} />
      <Route path="/sinal/:id" element={<AuthenticatedRoute><SignDetailPage /></AuthenticatedRoute>} />
      <Route path="/perfil" element={<AuthenticatedRoute><ProfilePage /></AuthenticatedRoute>} />


      {/* --- Rotas de Administração Protegidas --- */}
      <Route path='/admin' element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
      <Route path='/admin/users' element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
      <Route path='/admin/evaluators' element={<ProtectedRoute><AdminEvaluatorsPage /></ProtectedRoute>} />
      <Route path='/admin/institutions' element={<ProtectedRoute><AdminInstitutionsPage /></ProtectedRoute>} />
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