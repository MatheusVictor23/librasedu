// src/pages/SignsPage.jsx

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import SignCard from '../components/SignCard';
import StatCard from '../components/StatCard';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { Plus, Trophy } from 'lucide-react';

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

  const heroContent = (
    <div className="container mx-auto max-w-6xl px-6 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div className="flex-1 mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tem um <span className="text-brand-blue">sinal novo</span>? Compartilhe e ajude a fortalecer nossa comunidade.
          </h2>
        </div>
        <div className="md:ml-6">
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
      <div className="container mx-auto max-w-6xl px-6 pb-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
            Explorar
          </h2>
          {loading ? (
             <p className="text-white text-center">A carregar...</p>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Sinais em alta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingSigns.map((sign) => <SignCard key={`alta-${sign.id}`} sign={sign} />)}
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Sinais recentes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentSigns.map((sign) => <SignCard key={`recentes-${sign.id}`} sign={sign} />)}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Suas Estatísticas
          </h2>
          {loading ? (
            <p className="text-center">A carregar estatísticas...</p>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-500 to-brand-blue rounded-lg p-6 text-white mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Posição no Ranking</h3>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">#{userStats.ranking || 'N/A'}</span>
                    </div>
                    <p className="text-blue-100 mt-2">Continue a contribuir para subir no ranking!</p>
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
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SignsPage;