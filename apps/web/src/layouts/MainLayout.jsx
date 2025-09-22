// src/layouts/MainLayout.jsx

import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const MainLayout = ({ hero, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-brand-background-light text-brand-text-primary">
        <div className="sticky top-0 z-50 container mx-auto max-w-6xl px-6 pt-6">
          <Navbar />
        </div>
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