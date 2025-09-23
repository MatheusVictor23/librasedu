import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import TabNavigation from '../components/TabNavigation';
import SignCard from '../components/SignCard';
import { useAuth } from '../context/AuthContext';
import { Search } from 'lucide-react';
import api from '../api/axiosConfig';

const UserDashboardPage = () => {
  const { user } = useAuth();
  
  // Estados para os diferentes tipos de sinais
  const [trendingSigns, setTrendingSigns] = useState([]);
  const [recentSigns, setRecentSigns] = useState([]);
  const [recommendedSigns, setRecommendedSigns] = useState([]);
  
  // Estados para a busca
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [activeTab, setActiveTab] = useState('alta');
  const [loading, setLoading] = useState(true);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
    }
    setIsSearching(true);
    setLoading(true);
    try {
        const response = await api.get(`/sinais?searchTerm=${searchTerm}`);
        setSearchResults(response.data);
    } catch (error) {
        console.error("Erro ao buscar:", error);
        setSearchResults([]);
    } finally {
        setLoading(false);
    }
  };


  const tabs = [
    { id: 'alta', label: 'Sinais em alta' },
    { id: 'recentes', label: 'Sinais recentes' },
    { id: 'recomendados', label: 'Recomendados' }
  ];

  const renderSinais = () => {
    if (loading) return <p className="text-white text-center">A carregar sinais...</p>;
    
    let sinaisToShow = [];
    if (activeTab === 'alta') sinaisToShow = trendingSigns;
    else if (activeTab === 'recentes') sinaisToShow = recentSigns;
    else sinaisToShow = recommendedSigns;

    if (sinaisToShow.length === 0) return <p className="text-white text-center">Nenhum sinal encontrado.</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sinaisToShow.map((sign) => (
          <SignCard key={`${activeTab}-${sign.id}`} sign={sign} />
        ))}
      </div>
    );
  };

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
      <div className="text-brand-text-primary">
        <div className="container mx-auto max-w-6xl px-6 pb-12">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
              Busque sinais e aprenda com a nossa comunidade.
            </h2>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <button type="submit" className="focus:outline-none p-2">
                    <Search className="w-6 h-6 text-gray-400 hover:text-brand-blue" />
                </button>
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent" 
                placeholder="Digite o sinal que você procura..." 
              />
            </form>
          </div>
          
          {isSearching ? (
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-white text-center mb-8" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
                    Resultados da Busca por "{searchTerm}"
                </h2>
                {loading ? (
                    <p className="text-white text-center">A pesquisar...</p>
                ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchResults.map((sign) => <SignCard key={`search-${sign.id}`} sign={sign} />)}
                    </div>
                ) : (
                    <p className="text-white text-center">Nenhum resultado encontrado.</p>
                )}
            </div>
          ) : (
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
              {renderSinais()}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDashboardPage;
