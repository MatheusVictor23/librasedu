// src/components/NavBar.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Bell, ChevronDown, User as UserIcon } from 'lucide-react';
import UserDropdown from './UserDropdown'; // Importamos o novo componente

const Logo = () => (
  <div className="flex flex-col items-center cursor-pointer">
    <Home className="text-white" size={28} strokeWidth={2.5} />
    <span className="text-xs font-bold text-white tracking-wider">PORTAL TAPIRI</span>
  </div>
);

const Navbar = () => {
  const { user } = useAuth(); // Hook para verificar se o usuário está logado
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Lógica para o link "Sinais"
  const handleSinaisClick = (e) => {
    if (!user) {
      e.preventDefault(); // Impede a navegação
      alert('Para ter acesso ao nosso banco de sinais, faça login ou cadastre-se!');
      // O ideal seria um modal, mas um alerta funciona por agora.
      // Você pode adicionar um botão no modal para redirecionar para navigate('/login').
    }
  };

  // Renderização da NavBar para usuário autenticado
  const renderAuthenticatedNav = () => (
    <div className="flex items-center space-x-4">
      {/* Barra de Busca */}
      <div className="relative hidden sm:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input 
          type="text" 
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-white focus:border-white sm:text-sm" 
          placeholder="Buscar sinais..." 
        />
      </div>
      
      {/* Ícone de Notificações */}
      <button className="text-white hover:text-gray-300 transition-colors">
        <Bell size={20} />
      </button>

      {/* Dropdown do Usuário */}
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 text-white"
        >
          {/* Usamos um ícone placeholder se não houver avatar */}
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.nome} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-blue-dark flex items-center justify-center">
              <UserIcon size={20} />
            </div>
          )}
        </button>
        
        {isDropdownOpen && (
          <UserDropdown 
            user={user} 
            onClose={() => setIsDropdownOpen(false)} 
          />
        )}
      </div>
    </div>
  );

  // Renderização da NavBar para visitante
  const renderVisitorNav = () => (
    <div className="flex items-center space-x-4">
      <div className="relative hidden sm:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input 
          type="text" 
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-white focus:border-white sm:text-sm" 
          placeholder="Buscar sinais..." 
        />
      </div>
      <Link to="/login">
        <button className="py-2 px-5 text-sm font-semibold text-white rounded-full border-2 border-white/80 hover:bg-white/10 transition-colors duration-300">
          Entrar
        </button>
      </Link>
    </div>
  );

  return (
    <nav className="bg-brand-blue/95 backdrop-blur-sm w-full rounded-2xl shadow-lg">
      <div className="px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Seção Esquerda (Logo e Links) */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link to={user ? "/dashboard" : "/"}>
                <Logo />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to={user ? "/dashboard" : "/"} className="text-white font-semibold px-3 py-2 text-sm">
                  Início
                </Link>
                {/* O Link de "Sinais" agora tem a lógica de clique */}
                <Link to="/sinais" onClick={handleSinaisClick} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  Sinais <ChevronDown size={16} className="ml-1" />
                </Link>
                <Link to="/apoema" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Apoema
                </Link>
                <Link to="/sobre-nos" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Sobre nós
                </Link>
              </div>
            </div>
          </div>

          {/* Seção Direita (Busca e Ações do Usuário) */}
          {/* Renderiza a parte direita da nav com base no estado de login */}
          {user ? renderAuthenticatedNav() : renderVisitorNav()}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;