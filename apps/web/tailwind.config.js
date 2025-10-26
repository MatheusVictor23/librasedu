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
        // Cores do Portal Tapiri - Nova paleta
        'brand-blue': {
          DEFAULT: '#122651',
          dark: '#0d1a3a',
          light: '#1a3366',
        },
        'brand-text': {
          primary: '#122651',
          secondary: '#4A5568',
        },
        'brand-background': {
          DEFAULT: '#EDEDED',
          light: '#F5F5F5',
          white: '#FFFFFF',
        },
      },
      backgroundImage: {
        // Gradiente apenas para landing page
        'landing-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        // Manter o gradiente antigo para compatibilidade (caso usado em outros lugares)
        'page-gradient': 'linear-gradient(to bottom, #F4F6F6, #39548f)',
      },
      animation: { 
        'fade-in': 'fadeIn 0.5s ease-out',
        'blob': 'blob 12s infinite',
      }, 
      keyframes: { 
        fadeIn: { 
          '0%': { opacity: 0 }, 
          '100%': { opacity: 1 } 
        },
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