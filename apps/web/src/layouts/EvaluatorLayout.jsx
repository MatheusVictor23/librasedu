// apps/web/src/layouts/EvaluatorLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, LogOut, Check, X, Menu } from 'lucide-react';
import { FaSignLanguage } from 'react-icons/fa';

const EvaluatorLogo = () => (
    <div className="p-4 border-b border-brand-blue-dark">
        <h1 className="text-2xl font-bold flex items-center text-white">
            <FaSignLanguage size={28} className="mr-3" />
            <span>Avaliador</span>
        </h1>
    </div>
);

const Sidebar = ({ isOpen, setIsOpen }) => {
    const sidebarRef = useRef(null);
    const { logoutAction } = useAuth(); // Importa a função de logout

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
                <EvaluatorLogo />
                <nav className="p-4 space-y-1 flex-grow">
                    <p className="text-blue-300 uppercase text-xs font-bold mb-2 px-3">Menu</p>
                    <NavLink to="/evaluator/dashboard" className={({ isActive }) => `flex items-center py-2 px-3 rounded text-blue-100 ${isActive ? 'bg-brand-blue-dark font-semibold' : 'hover:bg-brand-blue-dark'}`}>
                        <ClipboardList size={20} className="mr-3" /> Avaliações Pendentes
                    </NavLink>
                    <NavLink to="/evaluator/approved" className={({ isActive }) => `flex items-center py-2 px-3 rounded text-blue-100 ${isActive ? 'bg-brand-blue-dark font-semibold' : 'hover:bg-brand-blue-dark'}`}>
                        <Check size={20} className="mr-3" /> Sinais Aprovados
                    </NavLink>
                    <NavLink to="/evaluator/rejected" className={({ isActive }) => `flex items-center py-2 px-3 rounded text-blue-100 ${isActive ? 'bg-brand-blue-dark font-semibold' : 'hover:bg-brand-blue-dark'}`}>
                        <X size={20} className="mr-3" /> Sinais Recusados
                    </NavLink>
                </nav>
                {/* CORREÇÃO AQUI: Voltamos a ter o botão de Logout */}
                <div className="p-4 border-t border-brand-blue-dark">
                    <button 
                        onClick={logoutAction} 
                        className="w-full flex items-center py-2 px-3 rounded text-blue-100 hover:bg-brand-blue-dark"
                    >
                        <LogOut size={20} className="mr-3" /> Sair
                    </button>
                </div>
            </div>
            {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

const Topbar = ({ onMenuClick }) => {
    const { user, logoutAction } = useAuth();
    return (
        <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between px-6 py-3">
                <button onClick={onMenuClick} className="lg:hidden text-gray-600">
                    <Menu size={24} />
                </button>
                <div className="hidden lg:block flex-1"></div>
                <div className="flex items-center gap-4">
                    <span className="hidden md:block text-brand-text-primary">{user?.nome || 'Avaliador'}</span>
                    <button onClick={logoutAction} title="Sair" className="text-gray-600 hover:text-brand-blue">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

const EvaluatorLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
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

export default EvaluatorLayout;