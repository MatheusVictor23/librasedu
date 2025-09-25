// src/pages/SignsPage.jsx

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import SignCard from '../components/SignCard';
import StatCard from '../components/StatCard';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { Plus, Trophy } from 'lucide-react';
import ilustracao from '../assets/ilustracao4.png';

const SignsPage = () => {
  const [userStats, setUserStats] = useState({
    submitted: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    ranking: null
  });
  const [trendingSigns, setTrendingSigns] = useState([]);
  const [recentSigns, setRecentSigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, trendingRes, recentRes] = await Promise.all([
                api.get('/users/me/stats'),
                api.get('/sinais/trending'),
                api.get('/sinais/recent')
            ]);
            setUserStats(statsRes.data);
            setTrendingSigns(trendingRes.data);
            setRecentSigns(recentRes.data);
        } catch (error) {
            console.error("Erro ao carregar dados da página de sinais:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // --- HERO CONTENT ATUALIZADO ---
  const heroContent = (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-12 lg:gap-16">
        
        {/* Lado Esquerdo: Texto e Botão */}
        <div className="md:w-3/5">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary leading-tight">
            Tem um sinal novo? Compartilhe e ajude a fortalecer nossa comunidade.
          </h2>
          <div className="mt-8">
            <Link to="/propor-sinal">
              <button className="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-blue-dark transition-colors flex items-center space-x-2 mx-auto md:mx-0">
                <Plus size={20} />
                <span>Submeter novo sinal</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Lado Direito: Imagem com tamanho aumentado */}
        <div className="md:w-2/5 flex justify-center md:justify-end">
            <img 
                src={ilustracao}
                alt="Ilustração de uma pessoa a gravar um sinal em LIBRAS" 
                className="w-full max-w-sm lg:max-w-md" // Aumentei o tamanho máximo da imagem
            />
        </div>

      </div>
    </div>
  );

  return (
    <MainLayout hero={heroContent}>
      {/* --- A ALTERAÇÃO ESTÁ AQUI: Adicionado padding-top (pt-12 sm:pt-16) --- */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-primary text-center mb-6 sm:mb-8">
            Explorar Sinais
          </h2>
          {loading ? (
             <p className="text-center text-gray-600">A carregar...</p>
          ) : (
            <>
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Sinais em alta</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {trendingSigns.map((sign) => <SignCard key={`alta-${sign.id}`} sign={sign} />)}
                </div>
              </div>
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg font-semibold text-brand-text-primary mb-4">Sinais recentes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {recentSigns.map((sign) => <SignCard key={`recentes-${sign.id}`} sign={sign} />)}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Suas Estatísticas
          </h2>
          {loading ? (
            <p className="text-center text-gray-600">A carregar estatísticas...</p>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-500 to-brand-blue rounded-lg p-4 sm:p-6 text-white mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Posição no Ranking</h3>
                    <div className="flex items-baseline">
                      <span className="text-3xl sm:text-4xl font-bold">#{userStats.ranking || 'N/A'}</span>
                    </div>
                    <p className="text-blue-100 mt-2 text-sm sm:text-base">Continue a contribuir para subir no ranking!</p>
                  </div>
                  <Trophy size={40} className="text-yellow-300 sm:w-12 sm:h-12" />
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard type="submitted" value={userStats.submitted} label="Sinais Submetidos" />
                <StatCard type="approved" value={userStats.approved} label="Sinais Aprovados" />
                <StatCard type="rejected" value={userStats.rejected} label="Sinais Recusados" />
                <StatCard type="pending" value={userStats.pending} label="Sinais Pendentes" />
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SignsPage;
