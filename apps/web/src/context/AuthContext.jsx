// apps/web/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginAction = async (email, senha) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, senha });
      const { token: authToken, user: userData } = response.data;
      
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authUser', JSON.stringify(userData));

      if (userData.role === 'ADMIN') {
        navigate('/admin');
      } else if (userData.role === 'AVALIADOR') {
        navigate('/evaluator/dashboard');
      } else {
        // ATUALIZAÇÃO AQUI: Redireciona o usuário comum para o dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Falha no login', error);
      throw new Error('Credenciais inválidas');
    }
  };

  const logoutAction = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  const value = { token, user, loading, loginAction, logoutAction };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};