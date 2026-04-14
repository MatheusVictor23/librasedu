// src/components/UserForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const UserForm = ({ onUserAdded }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/users`, { nome, email });

      setNome('');
      setEmail('');
      onUserAdded();
      setMessage(`Usuário "${response.data.nome}" criado com sucesso!`);

    } catch (error) {
      setMessage('Erro ao criar usuário. Verifique os dados e tente novamente.');
      console.error('Erro no post:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Criar Novo Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary">Criar Usuário</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default UserForm;