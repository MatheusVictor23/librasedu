// src/pages/ProfilePage.jsx

import React from 'react';
import MainLayout from '../layouts/MainLayout';
import UserProfileCard from '../components/UserProfileCard';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { Trophy, Key } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  const userStats = {
    submitted: 127,
    approved: 127,
    rejected: 127,
    pending: 127,
    ranking: 12
  };

  const handleEditProfile = () => console.log('Edit profile clicked');
  const handleChangePassword = () => console.log('Change password clicked');

  return (
    // Usamos o MainLayout com a nova variante "simple"
    <MainLayout variant="simple">
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-1">
            <UserProfileCard user={user} onEditProfile={handleEditProfile} />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-r from-blue-500 to-brand-blue rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Posição no Ranking</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">#{userStats.ranking}</span>
                  </div>
                  <p className="text-blue-100 mt-2">Você está entre os top 15 contribuidores!</p>
                </div>
                <Trophy size={48} className="text-yellow-300" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard type="submitted" value={userStats.submitted} label="Sinais Submetidos" />
              <StatCard type="approved" value={userStats.approved} label="Sinais Aprovados" />
              <StatCard type="rejected" value={userStats.rejected} label="Sinais Recusados" />
              <StatCard type="pending" value={userStats.pending} label="Sinais Pendentes" />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-brand-text-primary">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sinais Publicados</h3>
                  <p className="text-gray-600 text-sm">Visualize todos os sinais que você publicou na plataforma.</p>
                </div>
                <hr/>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Sinais Salvos</h3>
                  <p className="text-gray-600 text-sm">Veja sua coleção pessoal de sinais salvos para estudo.</p>
                </div>
                <hr/>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Trocar Senha</h3>
                  <p className="text-gray-600 text-sm mb-4">Altere sua senha para manter sua conta segura.</p>
                  <button 
                    onClick={handleChangePassword}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Key size={16} />
                    <span>Alterar senha</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;