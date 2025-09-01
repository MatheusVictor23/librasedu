// src/layouts/AdminLayout.jsx
import React from 'react';
import { LayoutDashboard, Users, Newspaper, Settings } from 'lucide-react';

// Componente para o Logo do Admin
const AdminLogo = () => (
  <div className="flex items-center text-white p-4 border-b border-brand-blue-dark">
    <Settings size={28} className="mr-2" />
    <h1 className="text-2xl font-bold">
      Admin<span className="font-light opacity-80">Panel</span>
    </h1>
  </div>
);

// Componente da Barra Lateral
const Sidebar = () => (
  <div className="bg-brand-blue text-white w-64 flex-shrink-0 h-screen">
    <AdminLogo />
    <nav className="p-4">
      <a href="#" className="flex items-center py-2 px-3 rounded bg-brand-blue-dark text-white mb-1 font-semibold">
        <LayoutDashboard size={20} className="mr-3" />
        Dashboard
      </a>
      <a href="/admin/users" className="flex items-center py-2 px-3 rounded hover:bg-brand-blue-dark text-blue-100 mb-1">
        <Users size={20} className="mr-3" />
        Gerir Utilizadores
      </a>
      <a href="#" className="flex items-center py-2 px-3 rounded hover:bg-brand-blue-dark text-blue-100 mb-1">
        <Newspaper size={20} className="mr-3" />
        Gerir Sinais
      </a>
    </nav>
  </div>
);

// Componente da Barra Superior
const Topbar = () => (
  <header className="bg-white shadow-sm z-10">
    <div className="flex items-center justify-end px-6 py-3">
      <div className="flex items-center">
        <div className="relative">
          <button className="flex items-center focus:outline-none">
            <img className="h-8 w-8 rounded-full object-cover" src="https://i.pravatar.cc/150?img=10" alt="Admin photo" />
            <span className="ml-2 hidden md:block text-brand-text-primary">Admin</span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-background-light">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;