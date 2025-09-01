// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import loginIllustration from '../assets/taipiriLogin.png'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const { loginAction } = useAuth(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginAction(email, senha); 
    } catch (err) {
      setError(err.message || 'Falha ao fazer login.');
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-screen bg-brand-background-light p-4">
        <div className="relative flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Lado Esquerdo - Ilustração */}
          <div className="hidden md:flex w-1/2 items-center justify-center bg-brand-blue p-8">
             <img src={loginIllustration} alt="Ilustração Login" className="max-w-xs" />
          </div>

          {/* Lado Direito - Formulário */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-brand-text-primary mb-2">Bem-Vindo</h2>
            <p className="text-brand-text-secondary mb-8">Entre com o seu e-mail e senha para aceder à sua conta.</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-brand-text-secondary">Senha</label>
                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" variant="primary" className="w-full">
                Entrar
              </Button>
            </form>
            
            <p className="mt-8 text-center text-sm text-brand-text-secondary">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-brand-blue hover:underline">
                Cadastre-se agora.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};


const LoginPageWrapper = () => {
  return (
      <LoginPage/>
  )
}

export default LoginPageWrapper;