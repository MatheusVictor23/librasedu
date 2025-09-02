// apps/web/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useAuth();

  // 1. Se ainda estiver a carregar o estado de autenticação, não renderiza nada
  if (loading) {
    return null; // Ou um componente de Spinner/Loading
  }

  // 2. Após o carregamento, se não houver token ou o perfil não for ADMIN, redireciona
  if (!token || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  // 3. Se tudo estiver correto, renderiza a página
  return children;
};

export const EvaluatorRoute = ({ children }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return null;
  }
  
  if (!token || (user?.role !== 'AVALIADOR' && user?.role !== 'ADMIN')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};