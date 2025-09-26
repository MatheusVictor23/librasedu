import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { X, Youtube, Download } from 'lucide-react';

const PublishSinalModal = ({ proposal, onClose, onPublished }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Constrói a URL completa para o vídeo bruto e para o download
  const videoBrutoSrc = `http://localhost:3000/${proposal.videoBrutoUrl}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) {
      setError('A URL do YouTube é obrigatória.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await api.post(`/admin/proposals/${proposal.id}/publish`, { youtubeUrl });
      onPublished();
    } catch (err) { // CORREÇÃO AQUI: Adicionada a chaveta de abertura '{'
      console.error('Erro ao publicar sinal:', err);
      setError('Não foi possível publicar o sinal. Verifique a URL e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      {/* Aumentamos a largura máxima do modal para 'max-w-2xl' */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">Publicar Sinal: {proposal.nome}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Player de vídeo e botão de download */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-2">Pré-visualização do Vídeo Bruto</h4>
              <div className="w-full bg-gray-900 rounded-lg overflow-hidden mb-3">
                <video
                  key={videoBrutoSrc}
                  controls
                  className="w-full h-full object-contain max-h-72" // Limita a altura máxima
                >
                  <source src={videoBrutoSrc} type="video/mp4" />
                  Seu navegador não suporta a tag de vídeo.
                </video>
              </div>
              <a
                href={videoBrutoSrc}
                download // O atributo 'download' instrui o navegador a baixar o arquivo
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                <Download size={16} />
                Baixar Vídeo Bruto
              </a>
            </div>

            {/* Campo para inserir a URL do YouTube */}
            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700">URL do YouTube *</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Youtube size={16} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="youtubeUrl"
                  id="youtubeUrl"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          </div>

          <div className="flex justify-end items-center p-4 border-t gap-3 bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark disabled:bg-gray-400"
            >
              {isLoading ? 'A Publicar...' : 'Publicar Sinal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishSinalModal;