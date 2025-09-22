// src/components/UserProfileCard.jsx

import React from 'react';
import { Mail, Calendar, MapPin, Users } from 'lucide-react';

const UserProfileCard = ({ user, onEditProfile }) => {
  const {
    name = "Helena Silva",
    email = "helenaSilva@email.com",
    avatar,
    // O Prisma usa 'role', então vamos adaptar para usar um nome mais amigável
    role = "Usuário", 
    birthDate = "15/09/1998",
    location = "Manaus, Brasil"
  } = user || {};

  // Função para capitalizar a role (ex: USER -> Usuário)
  const formatRole = (role) => {
    if (!role) return 'Usuário';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Profile Picture and Name */}
      <div className="text-center mb-6">
        <img 
          src={avatar || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=31487A&color=fff`} 
          alt={name}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        <div className="flex items-center justify-center mt-2 text-gray-600">
          <Users size={16} className="mr-2" />
          <span className="text-sm">{formatRole(role)}</span>
        </div>
      </div>

      {/* User Information */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center text-gray-600">
          <Mail size={16} className="mr-3 text-gray-400" />
          <div>
            <div className="text-sm text-gray-500">E-mail</div>
            <div className="font-medium">{email}</div>
          </div>
        </div>

        <div className="flex items-center text-gray-600">
          <Calendar size={16} className="mr-3 text-gray-400" />
          <div>
            <div className="text-sm text-gray-500">Data de nascimento</div>
            <div className="font-medium">{birthDate}</div>
          </div>
        </div>

        <div className="flex items-center text-gray-600">
          <MapPin size={16} className="mr-3 text-gray-400" />
          <div>
            <div className="text-sm text-gray-500">Localização</div>
            <div className="font-medium">{location}</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <button 
        onClick={onEditProfile}
        className="w-full bg-brand-blue text-white py-3 rounded-lg font-semibold hover:bg-brand-blue-dark transition-colors"
      >
        Editar perfil
      </button>
    </div>
  );
};

export default UserProfileCard;