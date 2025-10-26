// src/pages/UserDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import TabNavigation from '../components/TabNavigation';
import SignCard from '../components/SignCard';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';
import api from '../api/axiosConfig';
import ilustracao from '../assets/inicio-user.svg';
import RankingSection from '../components/RankingSection';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [trendingSigns, setTrendingSigns] = useState([]);
  const [recentSigns, setRecentSigns] = useState([]);
  const [recommendedSigns, setRecommendedSigns] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [activeTab, setActiveTab] = useState('alta');
  const [loading, setLoading] = useState(true);

  // Busca inicial dos sinais
  useEffect(() => {
    const fetchSinais = async () => {
      try {
        setLoading(true);
        const [trendingRes, recentRes, recommendedRes] = await Promise.all([
          api.get('/sinais/trending'),
          api.get('/sinais/recent'),
          api.get('/sinais/recommended')
        ]);
        setTrendingSigns(trendingRes.data);
        setRecentSigns(recentRes.data);
        setRecommendedSigns(recommendedRes.data);
      } catch (error) {
        console.error("Erro ao buscar sinais:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSinais();
  }, []);

  // Processa busca da URL (vinda da NavBar)
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
      performSearch(searchQuery);
      // Remove o parâmetro da URL após processar
      setSearchParams({});
    }
  }, [searchParams]);

  const performSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    setLoading(true);
    try {
      const response = await api.get(`/sinais?searchTerm=${term}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Erro ao buscar:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const tabs = [
    { id: 'alta', label: 'Sinais em alta' },
    { id: 'recentes', label: 'Sinais recentes' },
    { id: 'recomendados', label: 'Recomendados' }
  ];

  const renderSinais = () => {
    if (loading) return <p className="text-gray-600 text-center">A carregar sinais...</p>;
    
    let sinaisToShow = [];
    if (activeTab === 'alta') sinaisToShow = trendingSigns;
    else if (activeTab === 'recentes') sinaisToShow = recentSigns;
    else sinaisToShow = recommendedSigns;

    if (sinaisToShow.length === 0) return <p className="text-gray-600 text-center">Nenhum sinal encontrado.</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sinaisToShow.map((sign) => (
          <SignCard key={`${activeTab}-${sign.id}`} sign={sign} />
        ))}
      </div>
    );
  };

  const heroContent = (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6 lg:gap-8">
        
        {/* Lado Esquerdo: Texto e Busca */}
        <div className="md:w-3/5 w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-text-primary leading-tight mb-2">
            Olá, <span className="text-brand-blue">{user?.nome}!</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-text-secondary mb-6">
            Busque sinais e aprenda com a nossa comunidade.
          </p>
          
          {/* Barra de Busca */}
          <form onSubmit={handleSearch} className="relative w-full max-w-xl md:max-w-none">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 pr-12 border border-gray-300 rounded-full text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent shadow-sm" 
              placeholder="Buscar sinais..." 
            />
            <button type="submit" className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none">
              <Search className="w-5 h-5 text-gray-400 hover:text-brand-blue transition-colors" />
            </button>
          </form>
        </div>

        {/* Lado Direito: Imagem */}
        <div className="md:w-2/5 flex justify-center md:justify-end">
          <img 
            src={ilustracao}
            alt="Ilustração de uma pessoa aprendendo LIBRAS" 
            className="w-48 sm:w-56 md:w-64 lg:w-72 h-auto"
          />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout hero={heroContent} variant="user">
      
      {/* Conteúdo original da página (Busca / Destaques) */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        
        {isSearching ? (
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary">
                Resultados da Busca por "<span className="text-brand-blue">{searchTerm}</span>"
              </h2>
              <button
                onClick={handleClearSearch}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                  <path d="M21 3v5h-5"/>
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                  <path d="M8 16H3v5"/>
                </svg>
                Voltar aos destaques
              </button>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mb-4"></div>
                <p className="text-gray-600 text-center">A pesquisar...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <p className="text-brand-text-secondary text-center mb-6">
                  {searchResults.length} {searchResults.length === 1 ? 'sinal encontrado' : 'sinais encontrados'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {searchResults.map((sign) => <SignCard key={`search-${sign.id}`} sign={sign} />)}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 text-lg font-medium mb-2">Nenhum resultado encontrado</p>
                <p className="text-gray-500 text-sm mb-4">Tente buscar com outros termos</p>
                <button
                  onClick={handleClearSearch}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors"
                >
                  ← Voltar aos destaques
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary text-center mb-6 sm:mb-8">
              Destaques da comunidade
            </h2>
            <div className="flex justify-center mb-6 sm:mb-8">
              <TabNavigation 
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="pills"
              />
            </div>
            {renderSinais()}
          </div>
        )}
      </div>

      {/* Seção de Ranking */}
      <RankingSection />

    </MainLayout>
  );
};

export default UserDashboardPage;