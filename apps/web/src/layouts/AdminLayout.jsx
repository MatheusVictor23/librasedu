// apps/web/src/layouts/AdminLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UsersRound, BookOpen, Settings, Menu, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// 1. Importe a sua logo a partir da pasta de assets
import PortalTapiriLogo from '../assets/ilustracao3.png'; // Verifique se o nome e extensão do ficheiro estão corretos

const AdminLogo = () => (
  <div className="flex items-center justify-center py-6 px-4 border-b border-brand-blue-dark">
    {/* ÚLTIMA ALTERAÇÃO: Aumentei a altura da logo para h-28 */}
    <img src={PortalTapiriLogo} alt="Portal Tapiri Logo" className="h-40 w-auto max-w-full object-contain" />
  </div>
);

const Sidebar = ({ isOpen, setIsOpen }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);
  
  return (
    <>
      <div 
        ref={sidebarRef}
        className={`bg-brand-blue text-white w-64 flex-shrink-0 h-screen fixed lg:relative lg:translate-x-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 flex flex-col`}
      >
        <AdminLogo />
        <nav className="p-4 space-y-1 flex-grow">
          <NavLink to="/admin" end className={({ isActive }) => `flex items-center py-2 px-3 rounded text-blue-100 ${isActive ? 'bg-brand-blue-dark font-semibold' : 'hover:bg-brand-blue-dark'}`}>
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `flex items-center py-2 px-3 rounded text-blue-100 ${isActive ? 'bg-brand-blue-dark font-semibold' : 'hover:bg-brand-blue-dark'}`}>
            <Users size={20} className="mr-3" /> Gerir Utilizadores
          </NavLink>
          <NavLink to="/admin/evaluators" className={({ isActive }) => `flex items-center py-2 px-3 rounded text-blue-100 ${isActive ? 'bg-brand-blue-dark font-semibold' : 'hover:bg-brand-blue-dark'}`}>
            <UsersRound size={20} className="mr-3" /> Gerir Avaliadores
          </NavLink>
          <NavLink to="/admin/sinais" className={({ isActive }) => `flex items-center py-2 px-3 rounded text-blue-100 ${isActive ? 'bg-brand-blue-dark font-semibold' : 'hover:bg-brand-blue-dark'}`}>
            <BookOpen size={20} className="mr-3" /> Consultar Sinais
          </NavLink>
        </nav>
        {/* 3. Nova secção inferior para preencher o espaço vazio */}
        <div className="p-4 border-t border-brand-blue-dark">
            <NavLink to="/admin/settings" className={({ isActive }) => `flex items-center py-2 px-3 rounded text-blue-100 ${isActive ? 'bg-brand-blue-dark font-semibold' : 'hover:bg-brand-blue-dark'}`}>
                <Settings size={20} className="mr-3" /> Definições
            </NavLink>
        </div>
      </div>
      {/* Overlay para ecrãs móveis */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

const Topbar = ({ onMenuClick }) => {
    const { user, logoutAction } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between px-6 py-3">
                <button onClick={onMenuClick} className="lg:hidden text-brand-text-secondary">
                    <Menu size={24} />
                </button>
                <div className="flex-1"></div> {/* Spacer */}
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
                        <UserCircle size={32} className="text-gray-400" />
                        <span className="ml-2 hidden md:block text-brand-text-primary">{user?.nome || 'Admin'}</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                            <button onClick={logoutAction} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <LogOut size={16} className="mr-2" /> Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-brand-background-light">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;