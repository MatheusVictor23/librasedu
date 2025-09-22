// src/pages/UserDashboardPage.jsx

import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import TabNavigation from '../components/TabNavigation';
import SignCard from '../components/SignCard';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('alta');

  const mockSigns = Array(6).fill(null).map((_, index) => ({
    id: index + 1,
    title: "Banco de dados",
    likes: Math.floor(Math.random() * 100),
    saves: Math.floor(Math.random() * 50),
    isLiked: Math.random() > 0.5,
    isSaved: Math.random() > 0.5
  }));

  const tabs = [
    { id: 'alta', label: 'Sinais em alta' },
    { id: 'recentes', label: 'Sinais recentes' },
    { id: 'recomendados', label: 'Recomendados' }
  ];

  // Conteúdo da parte de cima (fundo claro)
  const heroContent = (
    <div className="container mx-auto max-w-6xl px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo(a) ao <span className="text-brand-blue">Portal Tapiri</span>, {user?.nome}!
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Continue sua jornada no aprendizado de Libras. Explore novos sinais, 
          contribua com a comunidade e aprofunde seus conhecimentos na língua brasileira de sinais.
        </p>
      </div>
    </div>
  );

  return (
    <MainLayout hero={heroContent}>
      {/* O resto do conteúdo vai aqui, e aparecerá na área do gradiente */}
      <div className="text-brand-text-primary">
        <div className="container mx-auto max-w-6xl px-6 pb-12">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
              Busque sinais e aprenda com a nossa comunidade.
            </h2>
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="w-full px-6 py-4 border border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent" 
                placeholder="Digite o sinal que você procura..." 
              />
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
              Destaques da comunidade
            </h2>
            <div className="flex justify-center mb-8">
              <TabNavigation 
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="pills"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSigns.map((sign) => (
                <SignCard key={sign.id} sign={sign} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDashboardPage;