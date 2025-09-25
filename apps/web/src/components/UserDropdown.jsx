// src/components/UserDropdown.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

const UserDropdown = ({ user, onClose }) => {
  const { logoutAction } = useAuth();

  return (
    <div 
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
      onMouseLeave={onClose} // Fecha o menu se o mouse sair
    >
      <div className="px-4 py-2 text-sm text-gray-700">
        <p className="font-semibold">{user?.nome || 'Usuário'}</p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>
      <div className="border-t border-gray-100"></div>
      <Link 
        to="/perfil" 
        onClick={onClose}
        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <User size={16} className="mr-2" />
        Meu Perfil
      </Link>
      <button 
        onClick={() => {
          logoutAction();
          onClose();
        }}
        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        <LogOut size={16} className="mr-2" />
        Sair
      </button>
    </div>
  );
};

export default UserDropdown;