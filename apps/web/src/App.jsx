// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './components/Card.jsx';
import './App.css';

// A URL da nossa API rodando no Docker
const API_URL = 'http://localhost:3000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar os usuários da API
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Faz a requisição GET para o endpoint de usuários
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError('Não foi possível carregar os usuários.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  return (
    <main className="app-container">
      <Card>
        <div className="user-list">
          <h2>Lista de Usuários da API</h2>
          {loading && <p>Carregando...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {users.length > 0 && (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <strong>{user.nome}</strong> ({user.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </main>
  );
}

export default App;