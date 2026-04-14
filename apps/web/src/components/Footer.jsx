// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import illustrationUrl from "../assets/ilustracao3.png";

const Footer = ({ variant = 'user' }) => {
  const currentYear = new Date().getFullYear();
  const isLanding = variant === 'landing';
  
  // --- ALTERAÇÃO AQUI ---
  // Trocamos 'bg-white/10 backdrop-blur-md' por 'bg-transparent'
  // para que o footer se misture com o gradiente da página.
  const bgClass = isLanding ? 'bg-transparent' : 'bg-brand-blue';
  
  const textClass = 'text-white';
  const textSecondaryClass = isLanding ? 'text-white/80' : 'text-white/70';
  const borderClass = isLanding ? 'border-white/20' : 'border-white/10';
  const inputBgClass = isLanding ? 'bg-white/90' : 'bg-white';

  return (
    <footer className={`${bgClass} ${textClass} mt-auto`}>
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        
        {/* Seção da Newsletter */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/20 pb-8 mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 md:mb-0 text-center md:text-left">
            Assine nosso newsletter para ficar por dentro das novidades!
          </h3>
          <form className="flex w-full md:w-auto">
            <input 
              type="email" 
              placeholder="Insira seu e-mail..." 
              className={`w-full md:w-80 px-4 py-2.5 rounded-l-lg text-brand-text-primary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 ${inputBgClass}`}
            />
            <button 
              type="submit"
              className="px-6 py-2.5 bg-white text-brand-blue font-semibold rounded-r-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Inscrever
            </button>
          </form>
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left mb-12">
          
          {/* Coluna do Projeto (ocupa 2 colunas) */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <img 
                src={illustrationUrl}
                alt="Portal Tapiri Logo" 
                className="h-24 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className={`text-sm ${textSecondaryClass} leading-relaxed max-w-xs mx-auto md:mx-0`}>
              Um espaço colaborativo onde a diversidade constrói o maior acervo de sinais do Brasil.
            </p>
          </div>
          
          {/* Coluna de Navegação */}
          <div>
            <h5 className="font-bold text-white mb-4">Navegação</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className={`${textSecondaryClass} hover:text-white transition-colors`}>
                  Início
                </Link>
              </li>
              <li>
                <Link to="/sinais" className={`${textSecondaryClass} hover:text-white transition-colors`}>
                  Sinais
                </Link>
              </li>
              <li>
                <Link to="/apoema" className={`${textSecondaryClass} hover:text-white transition-colors`}>
                  Apoema
                </Link>
              </li>
              <li>
                <Link to="/sobre-nos" className={`${textSecondaryClass} hover:text-white transition-colors`}>
                  Sobre nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna de Parcerias */}
          <div>
            <h5 className="font-bold text-white mb-4">Parcerias</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://portal.ifam.edu.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${textSecondaryClass} hover:text-white transition-colors`}
                >
                  IFAM
                </a>
              </li>
              <li className={`${textSecondaryClass}`}>
                Espaço Curupira
              </li>
              <li className={`${textSecondaryClass}`}>
                Apoema Libras
              </li>
            </ul>
          </div>

          {/* Coluna de Redes Sociais */}
          <div>
            <h5 className="font-bold text-white mb-4">Redes Sociais</h5>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a 
                href="#" 
                aria-label="Twitter" 
                className={`${textSecondaryClass} hover:text-white transition-colors`}
              >
                <FaXTwitter size={24} />
              </a>
              <a 
                href="#" 
                aria-label="Instagram" 
                className={`${textSecondaryClass} hover:text-white transition-colors`}
              >
                <Instagram size={24} />
              </a>
              <a 
                href="#" 
                aria-label="YouTube" 
                className={`${textSecondaryClass} hover:text-white transition-colors`}
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Seção de Copyright */}
        <div className={`pt-8 border-t ${borderClass}`}>
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${textSecondaryClass}`}>
            <p>© {currentYear} Portal Tapiri. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link to="/termos" className={`${textSecondaryClass} hover:text-white transition-colors`}>
                Termos de uso
              </Link>
              <Link to="/privacidade" className={`${textSecondaryClass} hover:text-white transition-colors`}>
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;