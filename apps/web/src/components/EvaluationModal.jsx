// [INÍCIO DO CÓDIGO]
import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { X } from 'lucide-react';

const EvaluationModal = ({ proposal, onClose, onSave }) => {
  const [comentarios, setComentarios] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // NOVO: Constrói a URL completa para o vídeo bruto hospedado pela API
  const videoBrutoSrc = `http://localhost:3000/${proposal.videoBrutoUrl}`;

  const handleSubmit = async (status) => {
    setIsLoading(true);
    setError('');
    try {
      await api.post(`/evaluator/proposals/${proposal.id}/evaluate`, {
        status,
        comentarios,
      });
      onSave();
    } catch (err) {
      setError('Não foi possível submeter a avaliação. Tente novamente.');
      console.error('Erro ao submeter avaliação:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">{proposal.nome}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ALTERAÇÃO AQUI: Substituímos o iframe por um player de vídeo HTML5 */}
            <div className="w-full bg-gray-900 rounded-lg overflow-hidden">
              <video
                key={videoBrutoSrc} // A chave garante que o vídeo recarregue se a proposta mudar
                controls
                className="w-full h-full object-contain"
              >
                <source src={videoBrutoSrc} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
            </div>

            {/* Coluna da Descrição */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Descrição da Proposta:</h4>
                <p className="text-gray-600 text-sm">{proposal.descricao}</p>
              </div>
               <div>
                <h4 className="font-semibold text-gray-700">Detalhes:</h4>
                <p className="text-sm text-gray-600"><b>Disciplina:</b> {proposal.disciplina.nome}</p>
                <p className="text-sm text-gray-600"><b>Proponente:</b> {proposal.proposer.nome}</p>
              </div>
            </div>
          </div>

          {/* Campo de Comentários */}
          <div>
            <h4 className="font-semibold text-gray-700">Comentários da Avaliação:</h4>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-brand-blue"
              rows="3"
              placeholder="Adicione os seus comentários e justificações aqui..."
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

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
// [FIM DO CÓDIGO]