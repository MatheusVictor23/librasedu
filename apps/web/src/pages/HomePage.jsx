// src/pages/HomePage.jsx

import React from 'react';
import MainLayout from '../layouts/MainLayout';
import ContributeSection from '../components/ContributeSection';
import RankingSection from '../components/RankingSection';
import Button from '../components/Button';
import illustrationUrl from "../assets/ilustracao.png";
import statsIllustration from '../assets/ilustracao2.png';
import { Link } from 'react-router-dom';

const HomePage = () => {

  // Conteúdo da parte de cima (fundo claro) que será passado para o slot "hero" do layout
  const heroContent = (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 lg:pt-32 lg:pb-20 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
      {/* Imagem - Aparece primeiro no mobile */}
      <div className="md:w-1/2 order-1 md:order-2 flex justify-center" data-aos="fade-left">
        <img 
          src={illustrationUrl} 
          alt="Ilustração de uma pessoa ensinando libras em uma tela de computador" 
          className="w-full max-w-sm sm:max-w-md lg:max-w-xl"
        />
      </div>
      
      {/* Texto - Aparece depois no mobile */}
      <div className="md:w-1/2 text-center md:text-left order-2 md:order-1" data-aos="fade-right">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text-primary leading-tight">
          Compartilhe e descubra novos sinais em <span className="text-brand-blue">Libras</span>
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-brand-text-secondary max-w-xl md:mx-0 mx-auto">
          Um espaço colaborativo onde a comunidade constrói o maior acervo de sinais do Brasil.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button variant="primary"><Link to={"/register"} className="no-underline">Cadastre-se</Link></Button>
            <Button variant="secondary">Saiba mais ›</Button>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout hero={heroContent}>
      {/* O restante do conteúdo vai aqui como "children" e aparecerá na área do gradiente */}
      <section className="pt-20 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 text-brand-text-primary">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="bg-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-xl relative" data-aos="fade-up">
                <div className="relative z-10">
                  <div className="flex">
                    <div className="lg:w-3/5 text-center lg:text-left" data-aos="fade-right" data-aos-delay="200">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-text-primary leading-snug">
                            O Portal Tapiri conta com mais de <span className="text-brand-blue">15 mil sinais cadastrados</span>
                        </h2>
                        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-brand-text-secondary">
                            Ut quia nihil ut voluptatem aliquam non itaque tempore et veritatis omnis et ipsa sunt. Lorem ipsum dolor sit amet. Aut vitae animi quo sequi doloribus qui maiores enim qui iste odio.
                        </p>
                    </div>
                  </div>
                  <div className="my-8 sm:my-12"></div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center border-t border-gray-200 pt-6 sm:pt-8">
                      <div className="p-2 sm:p-4" data-aos="fade-up" data-aos-delay="300">
                          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-text-primary">15.000<span className="text-brand-blue">+</span></p>
                          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">Sinais cadastrados</p>
                      </div>
                      <div className="p-2 sm:p-4" data-aos="fade-up" data-aos-delay="400">
                          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-text-primary">700<span className="text-brand-blue">+</span></p>
                          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">Colaboradores</p>
                      </div>
                      <div className="p-2 sm:p-4" data-aos="fade-up" data-aos-delay="500">
                          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-text-primary">10<span className="text-brand-blue">+</span></p>
                          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">Linguistas</p>
                      </div>
                      <div className="p-2 sm:p-4" data-aos="fade-up" data-aos-delay="600">
                          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-text-primary">10<span className="text-brand-blue">+</span></p>
                          <p className="text-xs sm:text-sm text-brand-text-secondary mt-1">Especialistas</p>
                      </div>
                  </div>
                </div>
                <img 
                  src={statsIllustration} 
                  alt="Ilustração de uma colaboradora acenando" 
                  className="w-60 sm:w-80 lg:w-[512px] absolute -top-16 sm:-top-20 lg:-top-28 right-0 hidden lg:block"
                  data-aos="fade-left" 
                  data-aos-delay="100"
                />
            </div>
        </div>
      </section>
      <ContributeSection/>
      <RankingSection/>
    </MainLayout>
  );
};

export default HomePage;