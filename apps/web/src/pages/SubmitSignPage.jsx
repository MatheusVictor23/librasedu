// apps/web/src/pages/SubmitSignPage.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../api/axiosConfig';

const SubmitSignPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    videoUrl: '',
    disciplinaId: ''
  });
  
  const [disciplinas, setDisciplinas] = useState([]);
  const [showNewDisciplinaForm, setShowNewDisciplinaForm] = useState(false);
  const [newDisciplina, setNewDisciplina] = useState({ nome: '', cargaHoraria: 'A definir' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Função para buscar a lista de disciplinas
  const fetchDisciplinas = () => {
    api.get('/disciplinas')
      .then(response => setDisciplinas(response.data))
      .catch(err => {
        console.error("Erro ao buscar disciplinas", err);
        setError('Não foi possível carregar a lista de disciplinas.');
      });
  };

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDisciplinaChange = (e) => {
    const { value } = e.target;
    if (value === 'new') {
      setShowNewDisciplinaForm(true);
      setFormData(prev => ({ ...prev, disciplinaId: '' }));
    } else {
      setShowNewDisciplinaForm(false);
      setFormData(prev => ({ ...prev, disciplinaId: value }));
    }
  };

  const handleNewDisciplinaChange = (e) => {
    const { name, value } = e.target;
    setNewDisciplina(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    let finalDisciplinaId = formData.disciplinaId;

    try {
      // Se o formulário de nova disciplina estiver visível, cria primeiro a disciplina
      if (showNewDisciplinaForm) {
        if (!newDisciplina.nome.trim()) {
          setError('O nome da nova disciplina é obrigatório.');
          setIsLoading(false);
          return;
        }
        const response = await api.post('/disciplinas', newDisciplina);
        finalDisciplinaId = response.data.id; // Usa o ID da disciplina recém-criada
        
        // Atualiza a lista de disciplinas no dropdown
        fetchDisciplinas();
      }

      if (!finalDisciplinaId) {
        setError('Por favor, selecione uma disciplina.');
        setIsLoading(false);
        return;
      }

      // Prepara os dados finais para submeter a proposta
      const finalFormData = { ...formData, disciplinaId: finalDisciplinaId };

      await api.post('/sinais-propostos', finalFormData);
      setSuccess('Proposta de sinal enviada com sucesso! Obrigado pela sua contribuição.');
      
      // Limpa o formulário
      setFormData({ nome: '', descricao: '', videoUrl: '', disciplinaId: '' });
      setNewDisciplina({ nome: '', cargaHoraria: 'A definir' });
      setShowNewDisciplinaForm(false);

    } catch (err) {
      setError('Ocorreu um erro ao enviar a sua proposta. Por favor, verifique os dados e tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-brand-background-light py-16">
        <div className="container mx-auto max-w-2xl px-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-brand-text-primary mb-2">Propor um Novo Sinal</h1>
            <p className="text-brand-text-secondary mb-6">Contribua para a comunidade partilhando um novo sinal em LIBRAS.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome do Sinal */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Sinal</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              
              {/* Seleção de Disciplina */}
              <div>
                <label htmlFor="disciplinaId" className="block text-sm font-medium text-gray-700">Disciplina</label>
                <select name="disciplinaId" value={formData.disciplinaId} onChange={handleDisciplinaChange} required={!showNewDisciplinaForm} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="">Selecione uma disciplina</option>
                  {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                  <option value="new">+ Cadastrar nova disciplina</option>
                </select>
              </div>

              {/* Formulário para Nova Disciplina (condicional) */}
              {showNewDisciplinaForm && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nova Disciplina</h3>
                  <div>
                    <label htmlFor="newDisciplinaNome" className="block text-sm font-medium text-gray-700">Nome da Disciplina</label>
                    <input type="text" name="nome" value={newDisciplina.nome} onChange={handleNewDisciplinaChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                  </div>
                </div>
              )}

              {/* Link do Vídeo e Descrição */}
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">Link do Vídeo (YouTube)</label>
                <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} required placeholder="Ex: https://www.youtube.com/watch?v=..." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea name="descricao" value={formData.descricao} onChange={handleInputChange} required rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <div className="flex justify-end">
                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-full shadow-md hover:bg-brand-blue-dark transition-colors duration-300 disabled:bg-gray-400">
                  {isLoading ? 'A Enviar...' : 'Enviar Proposta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SubmitSignPage;