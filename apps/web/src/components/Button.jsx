// src/components/Button.jsx
import React from 'react';

const Button = ({ children, variant = 'primary', className, ...props }) => {
  // ALTERAÇÃO AQUI: Trocamos 'rounded-lg' por 'rounded-full'
  const baseStyles = 'px-6 py-3 font-semibold rounded-full shadow-md transition-colors duration-300';

  const styles = {
    primary: 'bg-brand-blue text-white hover:bg-brand-blue-dark',
    secondary: 'bg-white text-brand-blue border-2 border-brand-blue hover:bg-blue-50',
  };

  return (
    <button className={`${baseStyles} ${styles[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
// material ui, chakra, shadcn