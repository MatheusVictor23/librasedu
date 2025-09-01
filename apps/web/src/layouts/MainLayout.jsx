// src/layouts/MainLayout.jsx

import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="bg-brand-background-light min-h-screen">
      <div className="sticky top-0 z-50 container mx-auto max-w-6xl px-6 pt-6">
        <Navbar />
      </div>

      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;