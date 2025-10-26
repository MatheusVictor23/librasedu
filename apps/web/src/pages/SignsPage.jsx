// src/pages/SignsPage.jsx

import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import SignCard from '../components/SignCard';
import StatCard from '../components/StatCard';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import { Plus, Trophy } from 'lucide-react';
import ilustracao from '../assets/sinais-user.svg';

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
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8 lg:gap-12">
        
        {/* Lado Esquerdo: Texto e Botão */}
        <div className="md:w-3/5">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-text-primary leading-tight mb-2">
            Tem um <span className="text-brand-blue">sinal novo?</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-text-secondary mb-6">
            Compartilhe e ajude a fortalecer nossa comunidade.
          </p>
          <Link to="/propor-sinal">
            <button className="bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-blue-dark transition-colors flex items-center gap-2 mx-auto md:mx-0">
              <Plus size={20} />
              <span>Submeter novo sinal</span>
            </button>
          </Link>
        </div>

        {/* Lado Direito: Imagem */}
        <div className="md:w-2/5 flex justify-center md:justify-end">
          <img 
            src={ilustracao}
            alt="Ilustração de uma pessoa a gravar um sinal em LIBRAS" 
            className="w-full max-w-sm lg:max-w-md"
          />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout hero={heroContent} variant="user">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Seção Explorar Sinais */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-primary mb-6 text-center">
            Explorar Sinais
          </h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mb-4"></div>
              <p className="text-brand-text-secondary">A carregar sinais...</p>
            </div>
          ) : (
            <>
              {/* Sinais em alta */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-brand-text-primary mb-4">
                  Sinais em alta
                </h3>
                {trendingSigns.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {trendingSigns.map((sign) => (
                      <SignCard key={`alta-${sign.id}`} sign={sign} />
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-text-secondary text-center py-8">
                    Nenhum sinal em alta no momento.
                  </p>
                )}
              </div>

              {/* Sinais recentes */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-brand-text-primary mb-4">
                  Sinais recentes
                </h3>
                {recentSigns.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {recentSigns.map((sign) => (
                      <SignCard key={`recentes-${sign.id}`} sign={sign} />
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-text-secondary text-center py-8">
                    Nenhum sinal recente disponível.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Seção de Estatísticas */}
        <div className="mb-12 mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-text-primary mb-6 text-center">
            Suas Estatísticas
          </h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mb-4"></div>
              <p className="text-brand-text-secondary">A carregar estatísticas...</p>
            </div>
          ) : (
            <>
              {/* Card de Ranking */}
              <div className="bg-gradient-to-r from-blue-400 to-brand-blue rounded-xl p-6 text-white mb-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold mb-2">
                      Posição no Ranking
                    </h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl sm:text-5xl font-bold">
                        #{userStats.ranking || 'N/A'}
                      </span>
                    </div>
                    <p className="text-blue-100 text-sm">
                      Você está entre os top 15 contribuidores!
                    </p>
                    <p className="text-blue-100 text-sm mt-1">
                      Continue a contribuir para subir no ranking!
                    </p>
                  </div>
                  <Trophy size={48} className="text-yellow-300 flex-shrink-0 ml-4" />
                </div>
              </div>

              {/* Grid de Estatísticas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-brand-text-primary mb-1">
                    {userStats.submitted}
                  </div>
                  <div className="text-sm text-brand-text-secondary">
                    Sinais Submetidos
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {userStats.approved}
                  </div>
                  <div className="text-sm text-brand-text-secondary">
                    Sinais Aprovados
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {userStats.rejected}
                  </div>
                  <div className="text-sm text-brand-text-secondary">
                    Sinais Recusados
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {userStats.pending}
                  </div>
                  <div className="text-sm text-brand-text-secondary">
                    Sinais Pendentes
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SignsPage;