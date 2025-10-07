// apps/web/src/components/admin/MergeDisciplinaModal.jsx
import React, { useState } from 'react';
import { X, GitMerge } from 'lucide-react';

const MergeDisciplinaModal = ({ disciplina, approvedDisciplinas, onClose, onConfirm }) => {
  const [targetId, setTargetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!targetId) {
      alert('Por favor, selecione uma disciplina de destino.');
      return;
    }
    setIsLoading(true);
    await onConfirm(disciplina.id, targetId);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <GitMerge size={20} /> Mesclar Disciplina
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Você está prestes a mesclar a disciplina pendente <strong className="text-brand-blue">{disciplina.nome}</strong>.
            Todas as propostas de sinais associadas a ela serão movidas para a disciplina de destino. Esta ação não pode ser desfeita.
          </p>
          <div>
            <label htmlFor="targetId" className="block text-sm font-medium text-gray-700">Selecione a disciplina de destino *</label>
            <select
              id="targetId"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">-- Escolha uma disciplina aprovada --</option>
              {approvedDisciplinas
                .filter(d => d.id !== disciplina.id)
                .map(d => (
                  <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end items-center p-4 border-t gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancelar
          </button>
          <button onClick={handleConfirm} disabled={isLoading || !targetId} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark disabled:bg-gray-400">
            {isLoading ? 'A Mesclar...' : 'Confirmar Mesclagem'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MergeDisciplinaModal;