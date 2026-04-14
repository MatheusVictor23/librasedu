import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return null; // Ou um componente de Spinner/Loading
  }

  if (!token || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

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

// NOVO: Rota protegida para contribuidores
export const ContributorRoute = ({ children }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return null; // Ou um spinner
  }

  // Redireciona se não estiver logado OU se não tiver um idInstituicao
  if (!token || !user?.idInstituicao) {
    // Redireciona para a página de perfil para que ele possa fazer a solicitação
    return <Navigate to="/perfil" replace />;
  }

  return children;
};

export const AuthenticatedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return null; // Ou um spinner
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};