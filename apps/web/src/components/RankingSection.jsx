// src/components/RankingSection.jsx
import React from 'react';
// CORREÇÃO AQUI: Trocamos 'CheckBadge' por 'BadgeCheck'
import { Award, BadgeCheck } from 'lucide-react';

// Dados de exemplo (mock). No futuro, estes dados virão da nossa API.
const collaborators = [
  { rank: 1, name: 'Camila Albuquerque', role: 'Colaborador', score: 1689, avatar: 'https://i.pravatar.cc/150?img=1' },
  { rank: 2, name: 'Rafael Mendonça', role: 'Especialista', score: 1549, avatar: 'https://i.pravatar.cc/150?img=2' },
  { rank: 3, name: 'Marina Duarte', role: 'Especialista', score: 1200, avatar: 'https://i.pravatar.cc/150?img=3' },
  { rank: 4, name: 'Larissa Monteiro', role: 'Colaborador', score: 1050, avatar: 'https://i.pravatar.cc/150?img=4' },
  { rank: 5, name: 'Lucas Cavalcante', role: 'Colaborador', score: 958, avatar: 'https://i.pravatar.cc/150?img=5' },
];

const RankingSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Card do Cabeçalho */}
        <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden mb-8">
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

        {/* Lista do Ranking */}
        <div className="space-y-3">
          {collaborators.map((collab) => (
            <div key={collab.rank} className="bg-white rounded-2xl shadow-lg p-4 flex items-center transition hover:shadow-xl hover:scale-[1.02]">
              <div className="w-12 text-center">
                <p className="text-2xl font-bold text-gray-400">{collab.rank}</p>
              </div>
              <div className="w-16">
                <img src={collab.avatar} alt={collab.name} className="w-12 h-12 rounded-full object-cover" />
              </div>
              <div className="flex-grow text-left">
                <p className="font-bold text-brand-text-primary">{collab.name}</p>
                <p className="text-sm text-brand-text-secondary">{collab.role}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-brand-text-primary">{collab.score}</p>
                {/* CORREÇÃO AQUI: Usamos o nome correto do componente do ícone */}
                <BadgeCheck size={24} className="text-brand-blue" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RankingSection;