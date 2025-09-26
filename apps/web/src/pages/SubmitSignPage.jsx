// [INÍCIO DO CÓDIGO]
import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../api/axiosConfig';
import { FileUp, Info } from 'lucide-react'; // Ícones para a interface

const SubmitSignPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    disciplinaId: ''
  });
  const [videoFile, setVideoFile] = useState(null); // NOVO: Estado para armazenar o arquivo de vídeo
  
  const [disciplinas, setDisciplinas] = useState([]);
  const [showNewDisciplinaForm, setShowNewDisciplinaForm] = useState(false);
  const [newDisciplina, setNewDisciplina] = useState({ nome: '', cargaHoraria: 'A definir' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
  
  // NOVO: Handler para o input de arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Por favor, selecione um arquivo de vídeo válido.');
        setVideoFile(null);
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // Validação de 50MB
        setError('O arquivo de vídeo não pode ser maior que 50MB.');
        setVideoFile(null);
        return;
      }
      setVideoFile(file);
      setError(''); // Limpa o erro se o arquivo for válido
    }
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

    // Validação para garantir que um vídeo foi selecionado
    if (!videoFile) {
        setError('Por favor, selecione um arquivo de vídeo para enviar.');
        setIsLoading(false);
        return;
    }

    let finalDisciplinaId = formData.disciplinaId;

    try {
      if (showNewDisciplinaForm) {
        if (!newDisciplina.nome.trim()) {
          setError('O nome da nova disciplina é obrigatório.');
          setIsLoading(false);
          return;
        }
        const response = await api.post('/disciplinas', newDisciplina);
        finalDisciplinaId = response.data.id;
        fetchDisciplinas();
      }

      if (!finalDisciplinaId) {
        setError('Por favor, selecione uma disciplina.');
        setIsLoading(false);
        return;
      }

      // NOVO: Usar FormData para enviar arquivo e dados
      const submissionData = new FormData();
      submissionData.append('nome', formData.nome);
      submissionData.append('descricao', formData.descricao);
      submissionData.append('disciplinaId', finalDisciplinaId);
      submissionData.append('video', videoFile); // O nome 'video' deve corresponder ao do middleware

      // O Axios definirá automaticamente o Content-Type como multipart/form-data
      await api.post('/sinais-propostos', submissionData);
      setSuccess('Proposta de sinal enviada com sucesso! Obrigado pela sua contribuição.');
      
      // Limpa o formulário
      setFormData({ nome: '', descricao: '', disciplinaId: '' });
      setVideoFile(null);
      setNewDisciplina({ nome: '', cargaHoraria: 'A definir' });
      setShowNewDisciplinaForm(false);
      // Limpa o input de arquivo
      document.getElementById('video-upload').value = null;

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
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Sinal</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              
              <div>
                <label htmlFor="disciplinaId" className="block text-sm font-medium text-gray-700">Disciplina</label>
                <select name="disciplinaId" value={formData.disciplinaId} onChange={handleDisciplinaChange} required={!showNewDisciplinaForm} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="">Selecione uma disciplina</option>
                  {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                  <option value="new">+ Cadastrar nova disciplina</option>
                </select>
              </div>

              {showNewDisciplinaForm && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nova Disciplina</h3>
                  <div>
                    <label htmlFor="newDisciplinaNome" className="block text-sm font-medium text-gray-700">Nome da Disciplina</label>
                    <input type="text" name="nome" value={newDisciplina.nome} onChange={handleNewDisciplinaChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                  </div>
                </div>
              )}
              
              {/* NOVO: Bloco de Upload de Vídeo */}
              <div>
                  <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700 mb-2">Arquivo de Vídeo</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                          <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                              <label htmlFor="video-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue hover:text-brand-blue-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue">
                                  <span>Carregue um vídeo</span>
                                  <input id="video-upload" name="video" type="file" className="sr-only" accept="video/*" onChange={handleFileChange} />
                              </label>
                              <p className="pl-1">ou arraste e solte</p>
                          </div>
                          <p className="text-xs text-gray-500">MP4, MOV, WEBM até 50MB</p>
                          {videoFile && <p className="text-sm text-green-600 font-medium mt-2">Arquivo selecionado: {videoFile.name}</p>}
                      </div>
                  </div>
                  
                  {/* NOVO: Bloco de Instruções */}
                  <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4">
                      <div className="flex items-center">
                          <Info size={20} className="text-blue-600 mr-3" />
                          <div className="text-sm text-blue-700">
                              <p className="font-semibold">Instruções para o vídeo:</p>
                              <ul className="list-disc list-inside mt-1">
                                  <li>O fundo da imagem deve ser branco.</li>
                                  <li>A vestimenta deve priorizar cores neutras.</li>
                                  <li>O vídeo deve ter boa iluminação e resolução.</li>
                              </ul>
                          </div>
                      </div>
                  </div>
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
// [FIM DO CÓDIGO]