import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { PlusSquare, Upload, CheckCircle, XCircle, X, Building, MapPin, User } from 'lucide-react';

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
            <XCircle className="w-6 h-6 text-red-600" />
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

const SolicitarInstituicaoForm = () => {
  const [formData, setFormData] = useState({
    nomeInstituicao: '',
    cidade: '',
    estado: '',
    nomeRepresentante: '',
    cargoRepresentante: '',
  });
  const [docUsuario, setDocUsuario] = useState(null);
  const [docRepresentante, setDocRepresentante] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file && file.size < 10 * 1024 * 1024) {
      if (name === 'docUsuario') setDocUsuario(file);
      if (name === 'docRepresentante') setDocRepresentante(file);
    } else {
      if (name === 'docUsuario') setDocUsuario(null);
      if (name === 'docRepresentante') setDocRepresentante(null);
      showToast('error', 'Arquivo muito grande ou inválido. Máximo de 10MB.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docUsuario || !docRepresentante) {
      showToast('error', 'Por favor, envie ambos os documentos.');
      return;
    }

    setIsLoading(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    submissionData.append('docUsuario', docUsuario);
    submissionData.append('docRepresentante', docRepresentante);

    try {
      await api.post('/solicitacoes/instituicao', submissionData);
      showToast('success', 'Solicitação de nova instituição enviada com sucesso! Aguarde a aprovação do administrador.');
      setFormData({ nomeInstituicao: '', cidade: '', estado: '', nomeRepresentante: '', cargoRepresentante: '' });
      setDocUsuario(null);
      setDocRepresentante(null);
      e.target.reset();
    } catch (err) {
      showToast('error', 'Ocorreu um erro ao enviar a sua solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4">
          <div className="flex items-start gap-3">
            <PlusSquare className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Cadastrar Nova Instituição</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                A sua instituição não está na lista? Preencha o formulário abaixo com os dados da instituição 
                e envie os documentos comprovativos. Após a aprovação, ela estará disponível para vinculação.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados da Instituição */}
          <div className="bg-blue-50/50 rounded-xl p-5 border-2 border-blue-100 space-y-4">
            <h4 className="text-base font-bold text-brand-text-primary flex items-center gap-2 pb-3 border-b-2 border-blue-200">
              <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center">
                <Building size={16} className="text-white" />
              </div>
              <span>Dados da Instituição</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="nomeInstituicao" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                    <Building size={14} className="text-brand-blue" />
                  </div>
                  Nome da Instituição *
                </label>
                <input 
                  type="text" 
                  name="nomeInstituicao" 
                  id="nomeInstituicao"
                  value={formData.nomeInstituicao} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                  placeholder="Ex: Universidade Federal do Amazonas"
                />
              </div>
              
              <div>
                <label htmlFor="cidade" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                    <MapPin size={14} className="text-brand-blue" />
                  </div>
                  Cidade *
                </label>
                <input 
                  type="text" 
                  name="cidade" 
                  id="cidade"
                  value={formData.cidade} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                  placeholder="Ex: Manaus"
                />
              </div>
              
              <div>
                <label htmlFor="estado" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                    <MapPin size={14} className="text-brand-blue" />
                  </div>
                  Estado *
                </label>
                <input 
                  type="text" 
                  name="estado" 
                  id="estado"
                  value={formData.estado} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                  placeholder="Ex: Amazonas"
                />
              </div>
            </div>
          </div>

          {/* Dados do Representante */}
          <div className="bg-purple-50/50 rounded-xl p-5 border-2 border-purple-100 space-y-4">
            <h4 className="text-base font-bold text-brand-text-primary flex items-center gap-2 pb-3 border-b-2 border-purple-200">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span>Dados do Representante</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nomeRepresentante" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center">
                    <User size={14} className="text-purple-600" />
                  </div>
                  Nome do Representante *
                </label>
                <input 
                  type="text" 
                  name="nomeRepresentante" 
                  id="nomeRepresentante"
                  value={formData.nomeRepresentante} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  placeholder="Ex: João Silva"
                />
              </div>
              
              <div>
                <label htmlFor="cargoRepresentante" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-purple-100 flex items-center justify-center">
                    <User size={14} className="text-purple-600" />
                  </div>
                  Cargo do Representante *
                </label>
                <input 
                  type="text" 
                  name="cargoRepresentante" 
                  id="cargoRepresentante"
                  value={formData.cargoRepresentante} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                  placeholder="Ex: Diretor"
                />
              </div>
            </div>
          </div>

          {/* Documentos Comprovativos */}
          <div className="bg-green-50/50 rounded-xl p-5 border-2 border-green-100 space-y-4">
            <h4 className="text-base font-bold text-brand-text-primary flex items-center gap-2 pb-3 border-b-2 border-green-200">
              <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
                <Upload size={16} className="text-white" />
              </div>
              <span>Documentos Comprovativos</span>
            </h4>

            {/* Documento do Usuário */}
            <div>
              <label htmlFor="docUsuario" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center">
                  <Upload size={14} className="text-green-600" />
                </div>
                Seu Comprovativo de Vínculo *
              </label>
              <p className="text-xs text-brand-text-secondary mb-3 pl-7">
                Ex: Comprovante de matrícula, crachá, declaração da instituição, etc.
              </p>
              <input 
                type="file" 
                id="docUsuario" 
                name="docUsuario" 
                onChange={handleFileChange} 
                accept=".pdf,.jpg,.jpeg,.png" 
                required 
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-600 file:text-white
                  hover:file:bg-green-700
                  file:cursor-pointer file:transition-all
                  cursor-pointer
                  border-2 border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
              />
              {docUsuario && (
                <div className="mt-3 p-3 bg-green-100 border-2 border-green-300 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-green-800">Arquivo selecionado:</p>
                    <p className="text-xs text-green-700 truncate">{docUsuario.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Documento do Representante */}
            <div>
              <label htmlFor="docRepresentante" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center">
                  <Upload size={14} className="text-green-600" />
                </div>
                Comprovativo do Representante *
              </label>
              <p className="text-xs text-brand-text-secondary mb-3 pl-7">
                Ex: Portaria de nomeação, declaração da instituição, documento oficial, etc.
              </p>
              <input 
                type="file" 
                id="docRepresentante" 
                name="docRepresentante" 
                onChange={handleFileChange} 
                accept=".pdf,.jpg,.jpeg,.png" 
                required 
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-600 file:text-white
                  hover:file:bg-green-700
                  file:cursor-pointer file:transition-all
                  cursor-pointer
                  border-2 border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
              />
              {docRepresentante && (
                <div className="mt-3 p-3 bg-green-100 border-2 border-green-300 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-green-800">Arquivo selecionado:</p>
                    <p className="text-xs text-green-700 truncate">{docRepresentante.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:bg-brand-blue-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>A Enviar...</span>
                </>
              ) : (
                <>
                  <PlusSquare size={18} />
                  <span>Enviar Solicitação</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
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

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default SolicitarInstituicaoForm;