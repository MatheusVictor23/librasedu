// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // 1. Importar o Link
import { Home } from 'lucide-react';

const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
);

const Logo = () => (
  <div className="flex flex-col items-center cursor-pointer">
    <Home className="text-white" size={28} strokeWidth={2.5} />
    <span className="text-xs font-bold text-white tracking-wider">PORTAL TAPIRI</span>
  </div>
);

const Navbar = () => {
  return (
    // ALTERAÇÃO AQUI: Fundo com translucidez e efeito de desfoque
    <nav className="bg-brand-blue/95 backdrop-blur-sm w-full rounded-2xl shadow-lg">
      <div className="px-6">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-white font-semibold px-3 py-2 text-sm">Início</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Sinais ▾</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Apoema</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Sobre nós</a>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
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

        </div>
      </div>
    </nav>
  );
};

export default Navbar;