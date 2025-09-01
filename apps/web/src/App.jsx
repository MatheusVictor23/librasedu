// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePageWrapper from './pages/HomePage';
import RegisterPageWrapper from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePageWrapper />} />
      <Route path='/register' element={<RegisterPageWrapper />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/admin' element={<AdminDashboardPage />} />
      <Route path='/admin/users' element={<AdminUsersPage />} />
    </Routes>
  );
}

export default App;