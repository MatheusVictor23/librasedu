// src/pages/AboutPage.jsx
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { Target, Eye } from 'lucide-react';
import ilustrationUrl from '../assets/sobrenos.png';

const AboutPage = () => {
  return (
    <MainLayout variant="user">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg mb-16 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Texto - Lado Esquerdo */}
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-brand-text-primary block mb-2">Sobre</span>
                <span className="text-brand-blue block">Nós</span>
              </h1>
              {/* Linha decorativa sutil */}
              <div className="w-16 h-1 bg-brand-blue rounded-full mt-4"></div>
            </div>
            
            {/* Imagem - Lado Direito */}
            <div className="relative min-h-[300px] sm:min-h-[320px] md:min-h-[350px]">
              <img 
                src={ilustrationUrl}
                alt="Equipe colaborativa"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Seção: Nossa história, missão e visão - melhor hierarquia */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-text-primary mb-6 leading-snug">
            Nossa <span className="text-brand-blue">história, missão</span>
            <br />
            e <span className="text-brand-blue">visão</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-brand-text-secondary leading-relaxed text-base lg:text-lg">
              ​O Portal Tapiri nasceu da necessidade urgente de preencher a lacuna de vocabulário técnico em Libras (Língua Brasileira de Sinais), essencial para a inclusão plena na era digital. Nossa plataforma é a materialização do compromisso com um futuro educacional e profissional onde o acesso ao conhecimento não seja limitado por barreiras comunicacionais.
            </p>
            
          </div>
        </div>

        {/* Cards Missão e Visão - redesenhados com melhor hierarquia */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          
          {/* Card Missão */}
          <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-md hover:shadow-xl transition-all duration-300 relative group">
            {/* Barra lateral decorativa */}
            <div className="absolute left-0 top-10 bottom-10 w-1 bg-brand-blue rounded-r-full"></div>
            
            {/* Ícone no canto superior direito - redesenhado */}
            <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-brand-blue flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Target size={32} className="text-white" strokeWidth={2.5} />
            </div>
            
            <div className="pr-20">
              <h3 className="text-3xl font-bold text-brand-text-primary mb-5">Missão</h3>
              <p className="text-brand-text-secondary leading-relaxed text-lg">
                Promover a inclusão educacional e profissional de pessoas surdas, desenvolvendo e padronizando um dicionário visual e confiável de sinais em Libras. Garantimos que o acesso ao conhecimento técnico seja universal e contínuo, capacitando a comunidade surda para o mercado de trabalho do futuro.
              </p>
            </div>
          </div>

          {/* Card Visão */}
          <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-md hover:shadow-xl transition-all duration-300 relative group">
            {/* Barra lateral decorativa */}
            <div className="absolute left-0 top-10 bottom-10 w-1 bg-brand-blue rounded-r-full"></div>
            
            {/* Ícone no canto superior direito - redesenhado */}
            <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-brand-blue flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Eye size={32} className="text-white" strokeWidth={2.5} />
            </div>
            
            <div className="pr-20">
              <h3 className="text-3xl font-bold text-brand-text-primary mb-5">Visão</h3>
              <p className="text-brand-text-secondary leading-relaxed text-lg">
                Ser reconhecido como o principal e mais abrangente repositório de sinais técnicos em Libras do Brasil, expandindo nosso acervo para diversas áreas do conhecimento, e consolidando o Tapiri como referência em acessibilidade e ferramenta de apoio fundamental para o ensino bilíngue.
              </p>
            </div>
          </div>
        </div>

        {/* Seção adicional: Valores (simples e clean) */}
        <div className="bg-white rounded-3xl border border-gray-200 p-10 lg:p-12 shadow-md mb-16">
          <h3 className="text-2xl lg:text-3xl font-bold text-brand-text-primary text-center mb-10">
            Nossos <span className="text-brand-blue">Valores</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-brand-blue"></div>
              </div>
              <h4 className="font-bold text-brand-text-primary mb-2">Inclusão</h4>
              <p className="text-sm text-brand-text-secondary">Trabalhamos por uma sociedade mais inclusiva</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-brand-blue"></div>
              </div>
              <h4 className="font-bold text-brand-text-primary mb-2">Colaboração</h4>
              <p className="text-sm text-brand-text-secondary">Construímos juntos um futuro melhor</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-brand-blue"></div>
              </div>
              <h4 className="font-bold text-brand-text-primary mb-2">Acessibilidade</h4>
              <p className="text-sm text-brand-text-secondary">Garantimos acesso para todas as pessoas</p>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default AboutPage;