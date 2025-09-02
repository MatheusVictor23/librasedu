// apps/web/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // 1. Adicionar um estado de 'loading'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 2. Usar useEffect para verificar o localStorage apenas uma vez, quando o app carrega
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    // Independentemente de encontrar ou não, a verificação inicial terminou
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
        navigate('/');
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

  // 3. Passar o estado 'loading' para o provider
  const value = { token, user, loading, loginAction, logoutAction };

  // 4. Não renderizar nada enquanto estiver a carregar o estado inicial
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};