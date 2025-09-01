// src/components/ContributeSection.jsx
import React from 'react';
import { Handshake, Upload, MessageSquareQuote, ArrowRight } from 'lucide-react';
import Button from './Button';

// Um sub-componente reutilizável para os cards de contribuição
const ContributeCard = ({ icon, title, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start text-left h-full">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-brand-text-primary">{title}</h3>
      <p className="mt-2 text-brand-text-secondary">{children}</p>
    </div>
  );
};

const ContributeSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        {/* ALTERAÇÃO AQUI: Adicionado o estilo 'text-shadow' para criar o contorno */}
        <h2 
          className="text-3xl md:text-4xl font-bold text-brand-text-primary" 
        >
          Como você pode contribuir com o <span className="text-brand-blue">Portal Tapiri</span>?
        </h2>

        {/* Grid para os cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ContributeCard 
            icon={<Handshake size={32} className="text-brand-blue" />}
            title="Seja nosso parceiro!"
          >
            Você pode contribuir com divulgação e blablablablabla
          </ContributeCard>
          
          <ContributeCard 
            icon={<Upload size={32} className="text-brand-blue" />}
            title="Submeta sinais!"
          >
            Submetendo sinais, você pode tornar nosso acervo mais rico.
          </ContributeCard>
          
          <ContributeCard 
            icon={<MessageSquareQuote size={32} className="text-brand-blue" />}
            title="Avalie sinais!"
          >
            Participe de nosso time de avaliadores especialistas em Libras.
          </ContributeCard>
        </div>

        {/* Botão de Chamada para Ação */}
        <div className="mt-16">
          <Button variant="primary" className="inline-flex items-center gap-3">
            Participe agora!
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContributeSection;