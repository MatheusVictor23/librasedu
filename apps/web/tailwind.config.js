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
      }
    },
  },
  plugins: [],
}