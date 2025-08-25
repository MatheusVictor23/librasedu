// src/components/Footer.jsx

import React from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent text-white">
      <div className="container mx-auto max-w-6xl px-6 pt-16 pb-8">
        {/* Seção da Newsletter */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/20 pb-8 mb-8">
          <h3 className="text-xl text-white font-semibold mb-4 md:mb-0 text-center md:text-left">
            Assine nosso newsletter para ficar por dentro das novidades!
          </h3>
          <form className="flex w-full md:w-auto mt-4 md:mt-0">
            <input 
              type="email" 
              placeholder="Insira seu e-mail..." 
              className="w-full md:w-80 px-4 py-2 rounded-l-lg text-brand-text-primary focus:outline-none"
            />
            <button 
              type="submit"
              className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-r-lg hover:bg-brand-blue-dark transition-colors"
            >
              Inscrever
            </button>
          </form>
        </div>

        {/* ALTERAÇÃO AQUI: 
          - Usamos um grid de 5 colunas para criar espaçamento consistente.
          - O logo ocupa 2 colunas e as outras 3 ocupam 1 coluna cada.
        */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left">
          
          {/* Coluna do Projeto (ocupa 2 colunas) */}
          <div className="col-span-2">
            <h4 className="text-2xl font-bold text-white mb-2">PORTAL TAPIRI</h4>
            <p className="text-gray-300 text-sm max-w-xs mx-auto md:mx-0">Um espaço colaborativo para a comunidade construir o maior acervo de sinais do Brasil.</p>
          </div>
          
          {/* Coluna de Navegação */}
          <div>
            <h5 className="font-bold text-white mb-4">Navegação</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition">Início</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Sinais</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Apoema</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition">Sobre nós</a></li>
            </ul>
          </div>

          {/* Coluna de Parcerias */}
          <div>
            <h5 className="font-bold text-white mb-4">Parcerias</h5>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">IFAM</li>
              <li className="text-gray-300">Espaço Curupira</li>
              <li className="text-gray-300">Apoema Libras</li>
            </ul>
          </div>

          {/* Coluna de Redes Sociais */}
          <div>
            <h5 className="font-bold text-white mb-4">Redes Sociais</h5>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-white transition"><FaXTwitter size={24} /></a>
              <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-white transition"><FaInstagram size={24} /></a>
              <a href="#" aria-label="YouTube" className="text-gray-300 hover:text-white transition"><FaYoutube size={24} /></a>
            </div>
          </div>
        </div>

        {/* Seção de Copyright */}
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-gray-400 flex flex-col md:flex-row justify-between">
          <p>© {currentYear} Portal Tapiri. Todos os direitos reservados.</p>
          <div className="space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Termos de uso</a>
              <a href="#" className="hover:text-white transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;