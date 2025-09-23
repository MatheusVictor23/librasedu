// src/layouts/MainLayout.jsx

import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const MainLayout = ({ hero, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar fixa completamente transparente */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-4 sm:pt-6">
          <Navbar />
        </div>
      </div>
      
      {/* Conteúdo com padding-top para compensar a navbar fixa */}
      <div className="bg-brand-background-light text-brand-text-primary pt-24 sm:pt-28">
        {hero}
      </div>
      <div className="bg-page-gradient flex flex-col flex-grow">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;