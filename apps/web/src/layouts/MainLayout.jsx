// src/layouts/MainLayout.jsx

import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const MainLayout = ({ hero, children, variant = 'default' }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar fixa com suporte para hide/show no scroll */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4 lg:pt-6">
          <Navbar />
        </div>
      </div>
      
      {/* Conteúdo com padding-top para compensar a navbar fixa */}
      {variant === 'landing' ? (
        // Layout para Landing Page (HomePage) - AGORA COM O GRADIENTE AZUL ANTIGO
        <>
          {/* --- ALTERAÇÃO 1 AQUI --- */}
          {/* O fundo do Hero deve ser a cor de início do gradiente azul */}
          <div className="bg-brand-background-light pt-20 sm:pt-24 lg:pt-28">
            {hero}
          </div>
          
          {/* --- ALTERAÇÃO 2 AQUI --- */}
          {/* Usamos o 'page-gradient' (azul) em vez do 'landing-gradient' (roxo) */}
          <div className="bg-page-gradient flex flex-col flex-grow">
            <main className="flex-grow">
              {children}
            </main>
            <Footer variant="landing" />
          </div>
        </>
      ) : variant === 'user' ? (
        // Layout para páginas do usuário - fundo #EDEDED consistente (Isto fica igual)
        <div className="bg-brand-background flex flex-col flex-grow pt-20 sm:pt-24 lg:pt-28">
          {hero && (
            <div className="bg-brand-background">
              {hero}
            </div>
          )}
          <main className="flex-grow bg-brand-background">
            {children}
          </main>
          <Footer variant="user" />
        </div>
      ) : (
        // Layout padrão/simples (Isto fica igual)
        <div className="bg-brand-background flex flex-col flex-grow pt-20 sm:pt-24 lg:pt-28">
          <main className="flex-grow">
            {children}
          </main>
          <Footer variant="user" />
        </div>
      )}
    </div>
  );
};

export default MainLayout;