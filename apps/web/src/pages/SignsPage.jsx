// src/pages/SignsPage.jsx

import React from 'react';
import MainLayout from '../layouts/MainLayout';
import SignCard from '../components/SignCard';
import StatCard from '../components/StatCard';
import { Link } from 'react-router-dom';
import { Plus, Trophy } from 'lucide-react';

const SignsPage = () => {
  // Dados estáticos para a UI
  const mockSigns = Array(3).fill(null).map((_, index) => ({
    id: index + 1,
    title: "Banco de dados",
    isLiked: Math.random() > 0.5,
    isSaved: Math.random() > 0.5
  }));

  const userStats = {
    submitted: 127,
    approved: 127,
    rejected: 127,
    pending: 127,
    ranking: 12
  };

  // Conteúdo da parte de cima (fundo claro)
  const heroContent = (
    <div className="container mx-auto max-w-6xl px-6 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tem um <span className="text-brand-blue">sinal novo</span>? Compartilhe e ajude a fortalecer nossa comunidade.
          </h2>
        </div>
        <div className="ml-6">
          <Link to="/propor-sinal">
            <button className="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-blue-dark transition-colors flex items-center space-x-2">
              <Plus size={20} />
              <span>Submeter sinal</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout hero={heroContent}>
      {/* Conteúdo principal (fundo de gradiente) */}
      <div className="container mx-auto max-w-6xl px-6 pb-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
            Explorar
          </h2>
          {/* Sinais em alta */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Sinais em alta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSigns.map((sign) => <SignCard key={`alta-${sign.id}`} sign={sign} />)}
            </div>
          </div>
          {/* Sinais recentes */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Sinais recentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSigns.map((sign) => <SignCard key={`recentes-${sign.id}`} sign={sign} />)}
            </div>
          </div>
        </div>

        {/* User Statistics Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Suas Estatísticas
          </h2>
          <div className="bg-gradient-to-r from-blue-500 to-brand-blue rounded-lg p-6 text-white mb-8">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard type="submitted" value={userStats.submitted} label="Sinais Submetidos" />
            <StatCard type="approved" value={userStats.approved} label="Sinais Aprovados" />
            <StatCard type="rejected" value={userStats.rejected} label="Sinais Recusados" />
            <StatCard type="pending" value={userStats.pending} label="Sinais Pendentes" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignsPage;