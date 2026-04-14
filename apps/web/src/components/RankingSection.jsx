// src/components/RankingSection.jsx
import React, { useState, useEffect } from 'react'; // 1. Importar hooks
import { BadgeCheck } from 'lucide-react';
import api from '../api/axiosConfig'; // 2. Importar axios

const RankingSection = () => {
  // 3. Estados para dados dinâmicos e loading
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);

  // 4. Efeito para buscar os dados do ranking
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await api.get('/public/ranking');
        setCollaborators(response.data);
      } catch (error) {
        console.error("Erro ao buscar o ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  // 5. Função para construir a URL do avatar
  const getAvatarUrl = (user) => {
    if (user.avatarUrl) {
      return `http://localhost:3000/${user.avatarUrl}`;
    }
    // Avatar padrão gerado com as iniciais do nome
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=31487A&color=fff`;
  };

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Card do Cabeçalho */}
        <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden mb-8" data-aos="fade-up">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary">
              Ranking dos melhores <br />
              <span className="text-brand-blue">colaboradores</span>
            </h2>
            <p className="mt-2 text-brand-text-secondary">Os membros mais ativos da nossa comunidade.</p>
          </div>
          {/* Ilustração do pódio */}
          <div className="absolute -right-4 -bottom-12 opacity-30">
            <div className="flex items-end gap-2">
                <div className="w-24 h-40 bg-gray-300 rounded-t-xl relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">🥈</span>
                </div>
                <div className="w-24 h-56 bg-yellow-300 rounded-t-xl relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">🥇</span>
                </div>
                <div className="w-24 h-32 bg-yellow-600/70 rounded-t-xl relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">🥉</span>
                </div>
            </div>
          </div>
        </div>

        {/* 6. Lista do Ranking Dinâmica */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-gray-500">A carregar ranking...</p>
          ) : collaborators.length > 0 ? (
            collaborators.map((collab, index) => (
              <div 
                key={collab.rank} 
                className="bg-white rounded-2xl shadow-lg p-4 flex items-center transition hover:shadow-xl hover:scale-[1.02]"
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <div className="w-12 text-center">
                  <p className="text-2xl font-bold text-gray-400">{collab.rank}</p>
                </div>
                <div className="w-16">
                  <img src={getAvatarUrl(collab)} alt={collab.name} className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div className="flex-grow text-left">
                  <p className="font-bold text-brand-text-primary">{collab.name}</p>
                  <p className="text-sm text-brand-text-secondary">{collab.role}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-brand-text-primary">{collab.score}</p>
                  <BadgeCheck size={24} className="text-brand-blue" />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center" data-aos="fade-up">
                <p className="text-brand-text-secondary">Ainda não há dados suficientes para formar um ranking. Seja o primeiro a contribuir!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RankingSection;