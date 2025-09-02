import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const navigate = useNavigate();

  const loginAction = async (email, senha) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, senha });
      const { token: authToken, user: userData } = response.data;
      
      setToken(authToken);
      setUser(userData);
      localStorage.setItem('authToken', authToken);

      if (userData.role === 'ADMIN') {
        navigate('/admin');
      }
      else if (userData.role === 'AVALIADOR') {
        navigate('/avaliador/sinais');
      }
      else {
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
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logoutAction }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};