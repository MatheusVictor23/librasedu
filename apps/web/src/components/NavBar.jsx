// src/components/NavBar.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Bell, ChevronDown, User as UserIcon, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Seção Esquerda (Logo) */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to={user ? "/dashboard" : "/"}>
                <Logo />
              </Link>
            </div>
            
            {/* Links de navegação - Desktop */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to={user ? "/dashboard" : "/"} className="text-white font-semibold px-3 py-2 text-sm hover:text-gray-200 transition-colors">
                  Início
                </Link>
                <Link to="/sinais" onClick={handleSinaisClick} className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  Sinais <ChevronDown size={16} className="ml-1" />
                </Link>
                <Link to="/apoema" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Apoema
                </Link>
                <Link to="/sobre-nos" className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Sobre nós
                </Link>
              </div>
            </div>
          </div>

          {/* Seção Direita - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? renderAuthenticatedNav() : renderVisitorNav()}
          </div>

          {/* Botão do menu mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-300 transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 mt-2 pt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {/* Links de navegação mobile */}
              <Link 
                to={user ? "/dashboard" : "/"} 
                className="text-white font-semibold px-3 py-2 text-base block hover:bg-white/10 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/sinais" 
                onClick={(e) => {
                  handleSinaisClick(e);
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:bg-white/10 px-3 py-2 text-base font-medium transition-colors block rounded-md"
              >
                Sinais
              </Link>
              <Link 
                to="/apoema" 
                className="text-white hover:bg-white/10 px-3 py-2 text-base font-medium transition-colors block rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apoema
              </Link>
              <Link 
                to="/sobre-nos" 
                className="text-white hover:bg-white/10 px-3 py-2 text-base font-medium transition-colors block rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sobre nós
              </Link>

              {/* Seção do usuário mobile */}
              {user ? (
                <div className="mt-4 pt-4 border-t border-white/20">
                  {/* Informações do usuário */}
                  <div className="flex items-center px-3 py-2 mb-3">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.nome} 
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-blue-dark flex items-center justify-center mr-3">
                        <UserIcon size={16} className="text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{user.nome}</p>
                      <p className="text-gray-300 text-xs">Usuário</p>
                    </div>
                  </div>
                  
                  {/* Ações do usuário */}
                  <div className="space-y-1">
                    <Link 
                      to="/perfil" 
                      className="text-white hover:bg-white/10 px-3 py-2 text-sm block rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Perfil
                    </Link>
                    <Link 
                      to="/propor-sinal" 
                      className="text-white hover:bg-white/10 px-3 py-2 text-sm block rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Propor Sinal
                    </Link>
                    <button 
                      className="text-red-300 hover:bg-red-500/10 px-3 py-2 text-sm block rounded-md transition-colors w-full text-left"
                      onClick={() => {
                        // Aqui seria a lógica de logout
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Sair
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-2 px-4 text-sm font-semibold text-brand-blue bg-white rounded-lg hover:bg-gray-100 transition-colors">
                      Entrar
                    </button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-2 px-4 text-sm font-semibold text-white border border-white/80 rounded-lg hover:bg-white/10 transition-colors">
                      Cadastrar-se
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;