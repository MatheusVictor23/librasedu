// src/components/Card.jsx
import React from 'react';
import './Card.css';

const Card = ({ children, className }) => {
  // O 'className' extra permite adicionar outros estilos se necessário
  return <div className={`card ${className || ''}`}>{children}</div>;
};

export default Card;