import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Building, Upload } from 'lucide-react';

const SolicitarVinculoForm = () => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [selectedInstituicao, setSelectedInstituicao] = useState('');
  const [documento, setDocumento] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Busca a lista de instituições existentes na API
    api.get('/instituicoes')
      .then(res => setInstituicoes(res.data))
      .catch(err => console.error("Erro ao buscar instituições", err));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 10 * 1024 * 1024) { // Limite de 10MB
      setDocumento(file);
      setMessage({ type: '', text: '' });
    } else {
      setDocumento(null);
      setMessage({ type: 'error', text: 'Arquivo muito grande ou inválido. Máximo de 10MB.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInstituicao || !documento) {
      setMessage({ type: 'error', text: 'Por favor, selecione uma instituição e um documento.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('instituicaoId', selectedInstituicao);
    formData.append('documento', documento);

    try {
      await api.post('/solicitacoes/vinculo', formData);
      setMessage({ type: 'success', text: 'Solicitação enviada com sucesso! Aguarde a aprovação do administrador.' });
      setSelectedInstituicao('');
      setDocumento(null);
      e.target.reset(); // Limpa o formulário
    } catch (err) {
      setMessage({ type: 'error', text: 'Ocorreu um erro ao enviar a sua solicitação.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Building size={20} className="mr-2" />
        Vincular-se a uma Instituição Existente
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="instituicaoId" className="block text-sm font-medium text-gray-700">Selecione a Instituição</label>
          <select
            id="instituicaoId"
            value={selectedInstituicao}
            onChange={(e) => setSelectedInstituicao(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">-- Escolha uma instituição --</option>
            {instituicoes.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.nome} ({inst.sigla})</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="doc-vinculo" className="block text-sm font-medium text-gray-700">Documento Comprovativo</label>
          <p className="text-xs text-gray-500 mb-2">Envie um documento (PDF, JPG, PNG) que comprove seu vínculo. Máx 10MB.</p>
          <input type="file" id="doc-vinculo" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {documento && <p className="text-xs text-green-600 mt-1">Arquivo selecionado: {documento.name}</p>}
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-dark transition-colors duration-300 disabled:bg-gray-400">
            {isLoading ? 'A Enviar...' : 'Enviar Solicitação'}
          </button>
        </div>
        {message.text && <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
      </form>
    </div>
  );
};

export default SolicitarVinculoForm;