// src/pages/HomePage.jsx

import React from 'react';
import MainLayout from '../layouts/MainLayout';
import ContributeSection from '../components/ContributeSection';
import RankingSection from '../components/RankingSection';
import Button from '../components/Button';
import illustrationUrl from "../assets/ilustracao.png";
import statsIllustration from '../assets/ilustracao2.png';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      {/* Seção 1: Hero com o fundo branco "lavado" e padding ajustado */}
      <section className="bg-brand-background-light">
        {/* ALTERAÇÃO AQUI: Aumentamos o padding superior (pt) para descer a seção */}
        <div className="container mx-auto max-w-6xl px-6 pt-24 pb-16 lg:pt-32 lg:pb-20 flex flex-col md:flex-row items-center justify-between gap-12">
          
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary leading-tight">
              Compartilhe e descubra novos sinais em <span className="text-brand-blue">Libras</span>
            </h1>
            <p className="mt-6 text-lg text-brand-text-secondary max-w-xl md:mx-0 mx-auto">
              Um espaço colaborativo onde a comunidade constrói o maior acervo de sinais do Brasil.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button variant="primary">Cadastre-se</Button>
                <Button variant="secondary">Saiba mais ›</Button>
            </div>
          </div>

          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
            <img 
              src={illustrationUrl} 
              alt="Ilustração de uma pessoa ensinando libras em uma tela de computador" 
              className="w-full max-w-xl"
            />
          </div>
        </div>
      </section>

      {/* Wrapper para o restante do conteúdo com o gradiente */}
      <div className="bg-page-gradient">
         {/* Seção 2: Estatísticas - ESTRUTURA FINAL CORRIGIDA */}
        <section className="pt-40 pb-20">
          <div className="container mx-auto max-w-6xl px-6">
              {/* Card principal com posicionamento relativo para conter a imagem */}
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl relative">
                  
                  {/* Container para o conteúdo principal do card */}
                  <div className="relative z-10">
                    {/* Parte Superior do Card: Apenas o Texto */}
                    <div className="flex">
                      <div className="lg:w-3/5 text-center lg:text-left">
                          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary leading-snug">
                              O Portal Tapiri conta com mais de <span className="text-brand-blue">15 mil sinais cadastrados</span>
                          </h2>
                          <p className="mt-4 text-brand-text-secondary">
                              Ut quia nihil ut voluptatem aliquam non itaque tempore et veritatis omnis et ipsa sunt. Lorem ipsum dolor sit amet. Aut vitae animi quo sequi doloribus qui maiores enim qui iste odio.
                          </p>
                      </div>
                    </div>

                    {/* Espaçador Vertical */}
                    <div className="my-12"></div>

                    {/* Parte Inferior do Card: Números */}
                    <div className="flex flex-col md:flex-row items-center justify-around text-center md:text-left border-t border-gray-200 pt-8">
                        <div className="flex-1 p-4">
                            <p className="text-4xl font-bold text-brand-text-primary">15.000<span className="text-brand-blue">+</span></p>
                            <p className="text-brand-text-secondary mt-1">Sinais cadastrados</p>
                        </div>
                        <div className="h-16 w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex-1 p-4">
                            <p className="text-4xl font-bold text-brand-text-primary">700<span className="text-brand-blue">+</span></p>
                            <p className="text-brand-text-secondary mt-1">Colaboradores</p>
                        </div>
                        <div className="h-16 w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex-1 p-4">
                            <p className="text-4xl font-bold text-brand-text-primary">10<span className="text-brand-blue">+</span></p>
                            <p className="text-brand-text-secondary mt-1">Linguistas</p>
                        </div>
                        <div className="h-16 w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex-1 p-4">
                            <p className="text-4xl font-bold text-brand-text-primary">10<span className="text-brand-blue">+</span></p>
                            <p className="text-brand-text-secondary mt-1">Especialistas</p>
                        </div>
                    </div>
                  </div>

                  {/* AJUSTE FINAL: Trocamos 'right-2' por 'right-0' */}
                  <img 
                    src={statsIllustration} 
                    alt="Ilustração de uma colaboradora acenando" 
                    className="w-80 lg:w-[512px] absolute -top-28 right-0 hidden lg:block"
                  />
              </div>
          </div>
        </section>
        <ContributeSection/>
        <RankingSection/>
        <Footer />
      </div>
    </>
  );
};

// Estrutura Wrapper para garantir que o MainLayout seja aplicado corretamente
const HomePageWrapper = () => (
  <MainLayout>
    <HomePage />
  </MainLayout>
);

export default HomePageWrapper;