import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import api from '../api/axiosConfig';
import { FileUp, Info, Send, CheckCircle, AlertCircle, Video, FileText, Tag, ArrowLeft, X } from 'lucide-react';

// Componente Toast de Notificação
const Toast = ({ type, message, onClose }) => {
  const isSuccess = type === 'success';
  
  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div className={`flex items-start gap-3 min-w-[320px] max-w-md p-4 rounded-xl shadow-2xl border-2 ${
        isSuccess 
          ? 'bg-green-50 border-green-500' 
          : 'bg-red-50 border-red-500'
      }`}>
        <div className="flex-shrink-0">
          {isSuccess ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-bold mb-1 ${
            isSuccess ? 'text-green-800' : 'text-red-800'
          }`}>
            {isSuccess ? 'Sucesso!' : 'Erro'}
          </h3>
          <p className={`text-sm ${
            isSuccess ? 'text-green-700' : 'text-red-700'
          }`}>
            {message}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
            isSuccess 
              ? 'hover:bg-green-100 text-green-600' 
              : 'hover:bg-red-100 text-red-600'
          }`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

const SubmitSignPage = () => {
  const navigate = useNavigate();
  const videoInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    disciplinaId: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  
  const [disciplinas, setDisciplinas] = useState([]);
  const [showNewDisciplinaForm, setShowNewDisciplinaForm] = useState(false);
  const [newDisciplina, setNewDisciplina] = useState({ nome: '', cargaHoraria: 'A definir' });
  
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchDisciplinas = () => {
    api.get('/disciplinas')
      .then(response => setDisciplinas(response.data))
      .catch(err => {
        console.error("Erro ao buscar disciplinas", err);
        showToast('error', 'Não foi possível carregar a lista de disciplinas.');
      });
  };

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        showToast('error', 'Por favor, selecione um arquivo de vídeo válido.');
        setVideoFile(null);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        showToast('error', 'O arquivo de vídeo não pode ser maior que 50MB.');
        setVideoFile(null);
        return;
      }
      setVideoFile(file);
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

  const resetForm = () => {
    setFormData({ nome: '', descricao: '', disciplinaId: '' });
    setVideoFile(null);
    setNewDisciplina({ nome: '', cargaHoraria: 'A definir' });
    setShowNewDisciplinaForm(false);
    
    // Limpa o input de vídeo de forma segura
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação do vídeo
    if (!videoFile) {
      showToast('error', 'Por favor, selecione um arquivo de vídeo para enviar.');
      setIsLoading(false);
      return;
    }

    let finalDisciplinaId = formData.disciplinaId;

    try {
      // Criar nova disciplina se necessário
      if (showNewDisciplinaForm) {
        if (!newDisciplina.nome.trim()) {
          showToast('error', 'O nome da nova disciplina é obrigatório.');
          setIsLoading(false);
          return;
        }
        const response = await api.post('/disciplinas', newDisciplina);
        finalDisciplinaId = response.data.id;
        await fetchDisciplinas();
      }

      // Validação da disciplina
      if (!finalDisciplinaId) {
        showToast('error', 'Por favor, selecione uma disciplina.');
        setIsLoading(false);
        return;
      }

      // Preparar e enviar dados
      const submissionData = new FormData();
      submissionData.append('nome', formData.nome);
      submissionData.append('descricao', formData.descricao);
      submissionData.append('disciplinaId', finalDisciplinaId);
      submissionData.append('video', videoFile);

      await api.post('/sinais-propostos', submissionData);
      
      // Sucesso - mostra toast e reseta formulário
      showToast('success', 'Proposta de sinal enviada com sucesso! Obrigado pela sua contribuição.');
      resetForm();

    } catch (err) {
      console.error('Erro ao enviar proposta:', err);
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao enviar a sua proposta. Por favor, verifique os dados e tente novamente.';
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout variant="user">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-brand-blue hover:text-brand-blue-dark mb-6 transition-colors font-medium group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        {/* Header com instruções */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text-primary mb-3">
            Propor um Novo Sinal
          </h1>
          <p className="text-base sm:text-lg text-brand-text-secondary max-w-2xl mx-auto">
            Contribua para a comunidade partilhando um novo sinal em LIBRAS. 
            Sua contribuição será avaliada por especialistas antes de ser publicada.
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-100 p-6 sm:p-8">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nome do Sinal */}
            <div className="space-y-2">
              <label htmlFor="nome" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                  <FileText size={14} className="text-brand-blue" />
                </div>
                Nome do Sinal *
              </label>
              <input 
                type="text" 
                name="nome" 
                id="nome"
                value={formData.nome} 
                onChange={handleInputChange} 
                placeholder="Ex: Computador, Educação, Matemática..."
                required 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all text-brand-text-primary placeholder-gray-400"
              />
            </div>
            
            {/* Disciplina */}
            <div className="space-y-2">
              <label htmlFor="disciplinaId" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                  <Tag size={14} className="text-brand-blue" />
                </div>
                Disciplina *
              </label>
              <select 
                name="disciplinaId" 
                id="disciplinaId"
                value={showNewDisciplinaForm ? 'new' : formData.disciplinaId} 
                onChange={handleDisciplinaChange} 
                required={!showNewDisciplinaForm} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all text-brand-text-primary appearance-none bg-white cursor-pointer"
              >
                <option value="">Selecione uma disciplina</option>
                {disciplinas.map(d => (
                  <option key={d.id} value={d.id}>{d.nome}</option>
                ))}
                <option value="new" className="font-semibold text-brand-blue">
                  + Cadastrar nova disciplina
                </option>
              </select>
            </div>

            {/* Formulário de Nova Disciplina */}
            {showNewDisciplinaForm && (
              <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200 animate-fade-in space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-brand-text-primary flex items-center gap-2">
                    <Tag size={18} className="text-brand-blue" />
                    Nova Disciplina
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewDisciplinaForm(false);
                      setNewDisciplina({ nome: '', cargaHoraria: 'A definir' });
                    }}
                    className="text-sm text-gray-600 hover:text-brand-blue transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                </div>
                <div>
                  <label htmlFor="newDisciplinaNome" className="block text-sm font-medium text-brand-text-primary mb-2">
                    Nome da Disciplina *
                  </label>
                  <input 
                    type="text" 
                    name="nome" 
                    id="newDisciplinaNome"
                    value={newDisciplina.nome} 
                    onChange={handleNewDisciplinaChange} 
                    placeholder="Ex: Biologia, Física, História..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all text-brand-text-primary placeholder-gray-400"
                    required 
                  />
                </div>
              </div>
            )}
            
            {/* Upload de Vídeo */}
            <div className="space-y-2">
              <label htmlFor="video-upload" className="block text-sm font-bold text-brand-text-primary mb-3 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                  <Video size={14} className="text-brand-blue" />
                </div>
                Arquivo de Vídeo *
              </label>
              
              <div className={`relative border-2 border-dashed rounded-xl transition-all ${
                videoFile 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 bg-gray-50 hover:border-brand-blue hover:bg-blue-50'
              }`}>
                <div className="px-6 py-8">
                  <div className="space-y-3 text-center">
                    {videoFile ? (
                      <>
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <div className="text-sm">
                          <p className="font-semibold text-green-700 mb-1">Vídeo selecionado:</p>
                          <p className="text-green-600">{videoFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            if (videoInputRef.current) {
                              videoInputRef.current.value = '';
                            }
                          }}
                          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                          Remover vídeo
                        </button>
                      </>
                    ) : (
                      <>
                        <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-sm text-gray-600">
                          <label 
                            htmlFor="video-upload" 
                            className="relative cursor-pointer font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors"
                          >
                            <span>Carregue um vídeo</span>
                            <input 
                              ref={videoInputRef}
                              id="video-upload" 
                              name="video" 
                              type="file" 
                              className="sr-only" 
                              accept="video/*" 
                              onChange={handleFileChange} 
                            />
                          </label>
                          <p>ou arraste e solte aqui</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Formatos aceitos: MP4, MOV, WEBM (máx. 50MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Instruções para o vídeo */}
              <div className="mt-4 bg-blue-50 border-l-4 border-brand-blue p-4 rounded-r-xl">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-brand-blue flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-brand-text-primary">
                    <p className="font-semibold mb-2">Instruções para gravação:</p>
                    <ul className="space-y-1 list-disc list-inside text-brand-text-secondary">
                      <li>Use fundo branco ou neutro</li>
                      <li>Vista roupas de cores neutras (evite branco)</li>
                      <li>Garanta boa iluminação e resolução</li>
                      <li>Enquadre todo o corpo ou do tronco para cima</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Descrição */}
            <div className="space-y-2">
              <label htmlFor="descricao" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                  <FileText size={14} className="text-brand-blue" />
                </div>
                Descrição *
              </label>
              <textarea 
                name="descricao" 
                id="descricao"
                value={formData.descricao} 
                onChange={handleInputChange} 
                placeholder="Descreva o contexto de uso e significado do sinal..."
                required 
                rows="5" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all text-brand-text-primary placeholder-gray-400 resize-none"
              />
              <p className="text-xs text-gray-500">
                Forneça detalhes sobre quando e como usar este sinal
              </p>
            </div>

            {/* Botão de Envio */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-blue-100">
              <p className="text-sm text-gray-600">
                * Campos obrigatórios
              </p>
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full sm:w-auto px-8 py-3 bg-brand-blue text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-brand-blue-dark transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>A Enviar...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Enviar Proposta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Informação adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sua proposta será avaliada por nossa equipe de especialistas em até 7 dias úteis.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </MainLayout>
  );
};

export default SubmitSignPage;