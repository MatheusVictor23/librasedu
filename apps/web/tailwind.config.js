/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brand-blue': {
          DEFAULT: '#31487A',
          dark: '#25385D',
        },
        'brand-text': {
          primary: '#1F2937', 
          secondary: '#6B7280',
        },
        'brand-background': {
          light: '#F4F6F6', // Cor de início do gradiente e da Hero Section
          DEFAULT: '#FFFFFF', 
        },
      },
      // Gradiente global da página, de cima para baixo
      backgroundImage: {
        'page-gradient': 'linear-gradient(to bottom, #F4F6F6, #39548f)',
      },
      animation: { 
        'fade-in': 'fadeIn 0.5s ease-out',
        // --- ALTERAÇÃO AQUI ---
        'blob': 'blob 12s infinite', // Aumentámos a duração para um movimento mais lento
      }, 
      keyframes: { 
        fadeIn: { 
          '0%': { opacity: 0 }, 
          '100%': { opacity: 1 } 
        },
        // --- ANIMAÇÃO DE FLUTUAÇÃO MELHORADA ---
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(100px, -80px) scale(1.2)',
          },
          '66%': {
            transform: 'translate(-80px, 50px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      }
    },
  },
  plugins: [],
}