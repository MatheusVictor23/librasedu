import React from 'react';
import { Mail, Building, Edit } from 'lucide-react';

const UserProfileCard = ({ user, onEditProfile }) => {
  // Se o usuário ainda não foi carregado, exibe um placeholder
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center animate-pulse">
        <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  const { nome, email, instituicao } = user;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=0D83FF&color=fff&size=128`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-brand-text-primary">
      <div className="flex flex-col items-center text-center">
        <img 
          src={avatarUrl}
          alt={`Avatar de ${nome}`}
          className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-sm"
        />
        <h2 className="text-xl font-bold text-gray-900">{nome}</h2>
        <p className="text-sm text-gray-500 mt-1">Membro desde 2024</p>
      </div>

      <hr className="my-6" />

      <div className="space-y-4 text-sm">
        <div className="flex items-center space-x-3">
          <Mail size={16} className="text-gray-400" />
          <span className="text-gray-600 truncate">{email}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Building size={16} className="text-gray-400" />
          <span className="text-gray-600">{instituicao?.nome || 'Instituição não informada'}</span>
        </div>
      </div>

      <button
        onClick={onEditProfile}
        className="mt-6 w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      >
        <Edit size={16} />
        <span>Editar Perfil</span>
      </button>
    </div>
  );
};

export default UserProfileCard;