import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Building, Upload, CheckCircle, XCircle, X } from 'lucide-react';

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

const SolicitarVinculoForm = () => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [selectedInstituicao, setSelectedInstituicao] = useState('');
  const [documento, setDocumento] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get('/instituicoes')
      .then(res => setInstituicoes(res.data))
      .catch(err => console.error("Erro ao buscar instituições", err));
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 10 * 1024 * 1024) {
      setDocumento(file);
    } else {
      setDocumento(null);
      showToast('error', 'Arquivo muito grande ou inválido. Máximo de 10MB.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInstituicao || !documento) {
      showToast('error', 'Por favor, selecione uma instituição e um documento.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('instituicaoId', selectedInstituicao);
    formData.append('documento', documento);

    try {
      await api.post('/solicitacoes/vinculo', formData);
      showToast('success', 'Solicitação enviada com sucesso! Aguarde a aprovação do administrador.');
      setSelectedInstituicao('');
      setDocumento(null);
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
        <div className="bg-blue-50 border-l-4 border-brand-blue rounded-r-xl p-4">
          <div className="flex items-start gap-3">
            <Building className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
            <p className="text-sm text-brand-text-secondary leading-relaxed">
              Selecione a instituição à qual você está vinculado e envie um documento comprovativo. 
              Após a aprovação do administrador, você poderá propor novos sinais.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Seleção de Instituição */}
          <div>
            <label htmlFor="instituicaoId" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                <Building size={14} className="text-brand-blue" />
              </div>
              Selecione a Instituição *
            </label>
            <select
              id="instituicaoId"
              value={selectedInstituicao}
              onChange={(e) => setSelectedInstituicao(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all text-brand-text-primary"
              required
            >
              <option value="">-- Escolha uma instituição --</option>
              {instituicoes.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.nome} {inst.sigla && `(${inst.sigla})`}
                </option>
              ))}
            </select>
          </div>

          {/* Upload de Documento */}
          <div>
            <label htmlFor="doc-vinculo" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                <Upload size={14} className="text-brand-blue" />
              </div>
              Documento Comprovativo *
            </label>
            <p className="text-xs text-brand-text-secondary mb-3 pl-7">
              Envie um documento (PDF, JPG, PNG) que comprove seu vínculo com a instituição. Máximo de 10MB.
            </p>
            
            <div className="relative">
              <input 
                type="file" 
                id="doc-vinculo" 
                onChange={handleFileChange} 
                accept=".pdf,.jpg,.jpeg,.png" 
                required 
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-brand-blue file:text-white
                  hover:file:bg-brand-blue-dark
                  file:cursor-pointer file:transition-all
                  cursor-pointer
                  border-2 border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue"
              />
            </div>
            
            {documento && (
              <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-800">Arquivo selecionado:</p>
                  <p className="text-xs text-green-700 truncate">{documento.name}</p>
                </div>
              </div>
            )}
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
                  <Upload size={18} />
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

export default SolicitarVinculoForm;