// apps/web/src/components/EvaluationModal.jsx
import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { X } from 'lucide-react';

const EvaluationModal = ({ proposal, onClose, onSave }) => {
  const [comentarios, setComentarios] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (status) => {
    setIsLoading(true);
    setError('');
    try {
      await api.post(`/evaluator/proposals/${proposal.id}/evaluate`, {
        status, // 'APROVADO' ou 'REJEITADO'
        comentarios,
      });
      onSave(); // Chama a função para fechar o modal e atualizar a lista
    } catch (err) {
      setError('Não foi possível submeter a avaliação. Tente novamente.');
      console.error('Erro ao submeter avaliação:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Cabeçalho do Modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{proposal.nome}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden border">
            <iframe
              src={proposal.videoUrl.replace("watch?v=", "embed/")} // Converte URL do YouTube para o formato embed
              title={`Vídeo para ${proposal.nome}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Descrição da Proposta:</h4>
            <p className="text-gray-600 text-sm">{proposal.descricao}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">Comentários da Avaliação:</h4>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-brand-blue"
              rows="4"
              placeholder="Adicione os seus comentários e justificações aqui..."
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Rodapé do Modal com os Botões de Ação */}
        <div className="flex justify-end items-center p-4 border-t gap-3">
          <button
            onClick={() => handleSubmit('REJEITADO')}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
          >
            Recusar Proposta
          </button>
          <button
            onClick={() => handleSubmit('APROVADO')}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? 'A Aprovar...' : 'Aprovar Sinal'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;