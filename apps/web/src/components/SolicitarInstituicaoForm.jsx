import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { PlusSquare } from 'lucide-react';

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
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file && file.size < 10 * 1024 * 1024) { // Limite de 10MB
      if (name === 'docUsuario') setDocUsuario(file);
      if (name === 'docRepresentante') setDocRepresentante(file);
      setMessage({ type: '', text: '' });
    } else {
      if (name === 'docUsuario') setDocUsuario(null);
      if (name === 'docRepresentante') setDocRepresentante(null);
      setMessage({ type: 'error', text: 'Arquivo muito grande ou inválido. Máximo de 10MB.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docUsuario || !docRepresentante) {
      setMessage({ type: 'error', text: 'Por favor, envie ambos os documentos.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    submissionData.append('docUsuario', docUsuario);
    submissionData.append('docRepresentante', docRepresentante);

    try {
      await api.post('/solicitacoes/instituicao', submissionData);
      setMessage({ type: 'success', text: 'Solicitação de nova instituição enviada com sucesso! Aguarde a aprovação do administrador.' });
      // Limpa o formulário
      setFormData({ nomeInstituicao: '', cidade: '', estado: '', nomeRepresentante: '', cargoRepresentante: '' });
      setDocUsuario(null);
      setDocRepresentante(null);
      e.target.reset();
    } catch (err) {
      setMessage({ type: 'error', text: 'Ocorreu um erro ao enviar a sua solicitação.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <PlusSquare size={20} className="mr-2" />
        Cadastrar Nova Instituição
      </h3>
      <p className="text-sm text-gray-600 mb-4">A sua instituição não está na lista? Preencha o formulário abaixo para solicitar o cadastro.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campos de texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="nomeInstituicao" className="block text-sm font-medium text-gray-700">Nome da Instituição *</label>
                <input type="text" name="nomeInstituicao" value={formData.nomeInstituicao} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
             <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700">Cidade *</label>
                <input type="text" name="cidade" value={formData.cidade} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
             <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado *</label>
                <input type="text" name="estado" value={formData.estado} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
             <div>
                <label htmlFor="nomeRepresentante" className="block text-sm font-medium text-gray-700">Nome do Representante *</label>
                <input type="text" name="nomeRepresentante" value={formData.nomeRepresentante} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
             <div>
                <label htmlFor="cargoRepresentante" className="block text-sm font-medium text-gray-700">Cargo do Representante *</label>
                <input type="text" name="cargoRepresentante" value={formData.cargoRepresentante} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
        </div>
        
        {/* Uploads de arquivo */}
        <div>
          <label htmlFor="docUsuario" className="block text-sm font-medium text-gray-700">Seu Comprovativo de Vínculo *</label>
          <p className="text-xs text-gray-500 mb-2">Ex: Comprovante de matrícula, crachá, etc.</p>
          <input type="file" id="docUsuario" name="docUsuario" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {docUsuario && <p className="text-xs text-green-600 mt-1">Arquivo selecionado: {docUsuario.name}</p>}
        </div>
        <div>
          <label htmlFor="docRepresentante" className="block text-sm font-medium text-gray-700">Comprovativo do Representante *</label>
          <p className="text-xs text-gray-500 mb-2">Ex: Portaria de nomeação, declaração da instituição, etc.</p>
          <input type="file" id="docRepresentante" name="docRepresentante" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {docRepresentante && <p className="text-xs text-green-600 mt-1">Arquivo selecionado: {docRepresentante.name}</p>}
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

export default SolicitarInstituicaoForm;