// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePageWrapper from './pages/HomePage';
import RegisterPageWrapper from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import LoginPage from './pages/LoginPage';
import AvaliadorPage from './pages/AvaliadorPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePageWrapper />} />
      <Route path='/register' element={<RegisterPageWrapper />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/admin' element={<AdminDashboardPage />} />
      <Route path='/admin/users' element={<AdminUsersPage />} />
      <Route path='/avaliador/sinais' element={<AvaliadorPage />} />
    </Routes>
  );
}

export default App;