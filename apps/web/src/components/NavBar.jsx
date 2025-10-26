// NavBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User as UserIcon, Menu, X } from 'lucide-react';
import UserDropdown from './UserDropdown';
import illustrationUrl from "../assets/ilustracao3.png";
import api from '../api/axiosConfig';

const Logo = () => (
  <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
    <img 
      src={illustrationUrl}
      alt="Portal Tapiri Logo" 
      className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
    />
  </div>
);

const Navbar = () => {
  const { user, logoutAction } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Estados para busca
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      } else if (lastScrollY - currentScrollY > 5) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleSinaisClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
  };

  // Função de busca desktop
  const handleSearchDesktop = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // Redireciona para dashboard com parâmetro de busca
    navigate(`/dashboard?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm('');
  };

  // Função de busca mobile
  const handleSearchMobile = async (e) => {
    e.preventDefault();
    if (!mobileSearchTerm.trim()) return;
    
    // Redireciona para dashboard com parâmetro de busca
    navigate(`/dashboard?search=${encodeURIComponent(mobileSearchTerm)}`);
    setMobileSearchTerm('');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/' || path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const renderAuthenticatedNav = () => (
    <div className="flex items-center gap-3 sm:gap-4">
      <form onSubmit={handleSearchDesktop} className="relative hidden sm:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </div>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-sm transition-all" 
          placeholder="Buscar sinais..." 
        />
      </form>

      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          aria-label="Menu do usuário"
        >
          {user?.avatarUrl ? (
            <img 
              src={`http://localhost:3000/${user.avatarUrl}`} 
              alt={user.nome} 
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-white/30"
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
              <UserIcon size={18} />
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

  const renderVisitorNav = () => (
    <div className="flex items-center gap-2 sm:gap-3">
      <form onSubmit={handleSearchDesktop} className="relative hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </div>
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-sm transition-all" 
          placeholder="Buscar sinais..." 
        />
      </form>
      <Link to="/login">
        <button className="py-1.5 sm:py-2 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white rounded-full border-2 border-white/80 hover:bg-white/10 transition-all">
          Entrar
        </button>
      </Link>
    </div>
  );

  return (
    <nav 
      className={`bg-brand-blue/95 backdrop-blur-sm w-full rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 flex-1 lg:flex-initial justify-center lg:justify-start">
            <div className="flex-shrink-0">
              <Link to={user ? "/dashboard" : "/"}>
                <Logo />
              </Link>
            </div>
            
            <div className="hidden lg:flex items-center gap-1">
              <Link 
                to={user ? "/dashboard" : "/"} 
                className={`text-white px-3 xl:px-4 py-2 text-sm rounded-lg transition-all relative ${
                  isActive('/dashboard') || isActive('/')
                    ? 'font-bold bg-white/20' 
                    : 'font-semibold hover:bg-white/10'
                }`}
              >
                Início
                {(isActive('/dashboard') || isActive('/')) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                )}
              </Link>
              <Link 
                to="/sinais" 
                onClick={handleSinaisClick} 
                className={`text-white px-3 xl:px-4 py-2 rounded-lg text-sm transition-all relative ${
                  isActive('/sinais') || isActive('/sinal/')
                    ? 'font-bold bg-white/20' 
                    : 'font-medium hover:bg-white/10'
                }`}
              >
                Sinais
                {(isActive('/sinais') || isActive('/sinal/')) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                )}
              </Link>
              <Link 
                to="/apoema" 
                className={`text-white px-3 xl:px-4 py-2 rounded-lg text-sm transition-all relative ${
                  isActive('/apoema')
                    ? 'font-bold bg-white/20' 
                    : 'font-medium hover:bg-white/10'
                }`}
              >
                Apoema
                {isActive('/apoema') && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                )}
              </Link>
              <Link 
                to="/sobre-nos" 
                className={`text-white px-3 xl:px-4 py-2 rounded-lg text-sm transition-all relative ${
                  isActive('/sobre-nos')
                    ? 'font-bold bg-white/20' 
                    : 'font-medium hover:bg-white/10'
                }`}
              >
                Sobre nós
                {isActive('/sobre-nos') && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                )}
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center">
            {user ? renderAuthenticatedNav() : renderVisitorNav()}
          </div>

          <div className="lg:hidden absolute left-3 sm:left-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/10 transition-all p-2 rounded-lg"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-3 sm:py-4">
            <form onSubmit={handleSearchMobile} className="relative mb-3 px-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input 
                type="text"
                value={mobileSearchTerm}
                onChange={(e) => setMobileSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm transition-all" 
                placeholder="Buscar sinais..." 
              />
            </form>

            <div className="flex flex-col gap-0.5 px-1 mb-3">
              <Link 
                to={user ? "/dashboard" : "/"} 
                className={`text-white px-3 py-2.5 text-[15px] rounded-lg transition-all ${
                  isActive('/dashboard') || isActive('/')
                    ? 'font-bold bg-white/20' 
                    : 'font-semibold hover:bg-white/10'
                }`}
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
                className={`text-white px-3 py-2.5 text-[15px] rounded-lg transition-all ${
                  isActive('/sinais') || isActive('/sinal/')
                    ? 'font-bold bg-white/20' 
                    : 'font-medium hover:bg-white/10'
                }`}
              >
                Sinais
              </Link>
              <Link 
                to="/apoema" 
                className={`text-white px-3 py-2.5 text-[15px] rounded-lg transition-all ${
                  isActive('/apoema')
                    ? 'font-bold bg-white/20' 
                    : 'font-medium hover:bg-white/10'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apoema
              </Link>
              <Link 
                to="/sobre-nos" 
                className={`text-white px-3 py-2.5 text-[15px] rounded-lg transition-all ${
                  isActive('/sobre-nos')
                    ? 'font-bold bg-white/20' 
                    : 'font-medium hover:bg-white/10'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sobre nós
              </Link>
            </div>

            {user ? (
              <div className="mt-3 pt-3 border-t border-white/20 px-1">
                <div className="flex items-center px-3 py-2.5 mb-2 bg-white/10 rounded-lg">
                  {user?.avatarUrl ? (
                    <img 
                      src={`http://localhost:3000/${user.avatarUrl}`} 
                      alt={user.nome} 
                      className="w-10 h-10 rounded-full mr-3 object-cover ring-2 ring-white/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3 ring-2 ring-white/30">
                      <UserIcon size={20} className="text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{user.nome}</p>
                    <p className="text-white/70 text-xs">Utilizador</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <Link 
                    to="/perfil" 
                    className={`text-white px-3 py-2.5 text-sm rounded-lg transition-all ${
                      isActive('/perfil')
                        ? 'font-bold bg-white/20' 
                        : 'font-medium hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Meu Perfil
                  </Link>
                  <Link 
                    to="/propor-sinal" 
                    className={`text-white px-3 py-2.5 text-sm rounded-lg transition-all ${
                      isActive('/propor-sinal')
                        ? 'font-bold bg-white/20' 
                        : 'font-medium hover:bg-white/10'
                    }`}
                    onClick={() => {
                      if (!user.idInstituicao) {
                        alert('É necessário um vínculo institucional para propor um sinal.');
                        navigate('/perfil');
                      }
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Propor Sinal
                  </Link>
                  <button 
                    className="text-red-300 hover:bg-red-500/20 px-3 py-2.5 text-sm font-medium rounded-lg transition-all w-full text-left"
                    onClick={() => {
                      logoutAction();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-white/20 px-1 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full py-2.5 px-4 text-sm font-semibold text-brand-blue bg-white rounded-lg hover:bg-gray-100 transition-all">
                    Entrar
                  </button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full py-2.5 px-4 text-sm font-semibold text-white border-2 border-white/80 rounded-lg hover:bg-white/10 transition-all">
                    Cadastrar-se
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;