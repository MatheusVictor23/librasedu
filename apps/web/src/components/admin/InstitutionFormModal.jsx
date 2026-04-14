import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { X } from 'lucide-react';

const InstitutionFormModal = ({ institution, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    cidade: '',
    estado: '',
    nomeRepresentante: '',
    cargoRepresentante: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(institution);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        nome: institution.nome || '',
        sigla: institution.sigla || '',
        cidade: institution.cidade || '',
        estado: institution.estado || '',
        nomeRepresentante: institution.nomeRepresentante || '',
        cargoRepresentante: institution.cargoRepresentante || '',
      });
    } else {
      setFormData({
        nome: '',
        sigla: '',
        cidade: '',
        estado: '',
        nomeRepresentante: '',
        cargoRepresentante: '',
      });
    }
  }, [institution, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validação de todos os campos
    for (const key in formData) {
      if (!formData[key].trim()) {
        setError(`O campo "${key}" é obrigatório.`);
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      if (isEditing) {
        await api.put(`/admin/instituicoes/${institution.id}`, formData);
      } else {
        await api.post('/admin/instituicoes', formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.details || 'Ocorreu um erro ao guardar a instituição.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Editar Instituição' : 'Adicionar Nova Instituição'}</h3>
            <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome da Instituição *</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label htmlFor="sigla" className="block text-sm font-medium text-gray-700">Sigla *</label>
                <input type="text" name="sigla" value={formData.sigla} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="flex justify-end items-center p-4 border-t gap-3 bg-gray-50 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark disabled:bg-gray-400">
              {isLoading ? 'A Guardar...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstitutionFormModal;