// src/components/Card.jsx
import React from 'react';

// Já não precisamos de importar o ficheiro CSS

const Card = ({ children, className }) => {
  // Aplicamos as classes do Tailwind diretamente aqui
  // bg-white = fundo branco, rounded-lg = bordas arredondadas, shadow-md = sombra média, p-6 = padding
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className || ''}`}>
      {children}
    </div>
  );
};

export default Card;