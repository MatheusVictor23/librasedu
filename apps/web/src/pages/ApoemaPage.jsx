// src/pages/ApoemaPage.jsx
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { Users, Video, Smartphone } from 'lucide-react';
import ilustrationUrl from '../assets/apoema.png';
import curupiraUrl from '../assets/curupira.png';

const ApoemaPage = () => {
  return (
    <MainLayout variant="user">
      <div className="container mx-auto max-w-4xl px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        
        {/* Logo do Apoema Libras - responsivo */}
        <div className="flex justify-center mb-6 sm:mb-8 lg:mb-10">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-md sm:max-w-lg border border-gray-100">
            <img 
              src={ilustrationUrl}
              alt="Logo Apoema Libras"
              className="w-full h-auto"
              style={{ maxHeight: '120px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Seção: Você sabe o que é Apoema Libras? - responsiva */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-text-primary mb-3 sm:mb-4 lg:mb-5 px-2">
            Você sabe o que é
            <br />
            <span className="text-brand-blue">Apoema Libras?</span>
          </h2>
          {/* Linha decorativa */}
          <div className="w-12 sm:w-16 h-1 bg-brand-blue rounded-full mx-auto mb-4 sm:mb-5 lg:mb-6"></div>
          
          <p className="text-brand-text-secondary leading-relaxed max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4">
            É um projeto que está criando um vocabulário visual da Libras, a Língua Brasileira de Sinais, 
            com vídeos de sinais do cotidiano.
          </p>
        </div>

        {/* Cards informativos - responsivos */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6 mb-8 sm:mb-10 lg:mb-12">
          
          {/* Card: Qual sua importância? */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-md p-5 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300 relative">
            {/* Barra lateral */}
            <div className="absolute left-0 top-6 sm:top-8 bottom-6 sm:bottom-8 w-1 bg-brand-blue rounded-r-full"></div>
            
            {/* Ícone pequeno e discreto */}
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-brand-blue"></div>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-text-primary">
                Qual sua <span className="text-brand-blue">importância?</span>
              </h3>
            </div>
            
            <div className="space-y-2 sm:space-y-3 text-brand-text-secondary leading-relaxed text-sm sm:text-base pl-11 sm:pl-14">
              <p>
                A maioria das pessoas não sabem Libras, e isso dificulta a vida de quem depende dela 
                para se comunicar.
              </p>
              <p>
                O Apoema Libras irá contribuir com a quebra dessa barreira.
              </p>
            </div>
          </div>

          {/* Card: Como funciona? */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-md p-5 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300 relative">
            {/* Barra lateral */}
            <div className="absolute left-0 top-6 sm:top-8 bottom-6 sm:bottom-8 w-1 bg-brand-blue rounded-r-full"></div>
            
            {/* Ícone discreto */}
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                <Video size={16} className="sm:w-[18px] sm:h-[18px] text-brand-blue" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-text-primary">
                Como <span className="text-brand-blue">funciona?</span>
              </h3>
            </div>
            
            <div className="space-y-2 sm:space-y-3 text-brand-text-secondary leading-relaxed text-sm sm:text-base pl-11 sm:pl-14">
              <p>
                Está sendo criada uma base com centenas de vídeos de sinais em Libras, com a participação 
                de cerca de 50 pessoas, 35 delas surdas.
              </p>
              <p>
                Essa base será gratuita e poderá ser usada em cursos de alfabetização em Libras e por 
                grupos de pesquisa.
              </p>
            </div>
          </div>

          {/* Card: Criação do aplicativo */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-md p-5 sm:p-6 lg:p-8 hover:shadow-lg transition-all duration-300 relative">
            {/* Barra lateral */}
            <div className="absolute left-0 top-6 sm:top-8 bottom-6 sm:bottom-8 w-1 bg-brand-blue rounded-r-full"></div>
            
            {/* Ícone discreto */}
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                <Smartphone size={16} className="sm:w-[18px] sm:h-[18px] text-brand-blue" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-text-primary">
                Criação do <span className="text-brand-blue">aplicativo</span>
              </h3>
            </div>
            
            <p className="text-brand-text-secondary leading-relaxed text-sm sm:text-base pl-11 sm:pl-14">
              Além disso, um aplicativo com Inteligência Artificial vai traduzir sinais de Libras em voz, 
              permitindo que quem não entende Libras consiga compreender o que está sendo sinalizado.
            </p>
          </div>
        </div>

        {/* Logo Espaço Curupira - responsivo */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 w-full max-w-xs sm:max-w-md border border-gray-100">
            <img 
              src={curupiraUrl}
              alt="Logo Espaço Curupira"
              className="w-full h-auto"
              style={{ maxHeight: '100px', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApoemaPage;