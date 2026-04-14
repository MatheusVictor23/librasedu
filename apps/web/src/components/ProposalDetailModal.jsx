import React from 'react';
import { X, Clock, CheckCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const statusConfig = {
      PENDENTE: { icon: <Clock size={14} />, text: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      APROVADO: { icon: <CheckCircle size={14} />, text: 'Aprovado', color: 'bg-green-100 text-green-800' },
      REJEITADO: { icon: <XCircle size={14} />, text: 'Rejeitado', color: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status] || {};
  
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.text}
      </span>
    );
};

const ProposalDetailModal = ({ proposal, onClose }) => {
  if (!proposal) return null;

  const videoBrutoSrc = proposal.videoBrutoUrl ? `http://localhost:3000/${proposal.videoBrutoUrl}` : null;

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
            <div className="w-full bg-gray-900 rounded-lg overflow-hidden aspect-video">
              {videoBrutoSrc ? (
                <video
                  key={videoBrutoSrc}
                  controls
                  className="w-full h-full object-contain"
                >
                  <source src={videoBrutoSrc} type="video/mp4" />
                  O seu navegador não suporta a tag de vídeo.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Vídeo não disponível.</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700">Status:</h4>
                <StatusBadge status={proposal.status} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Descrição:</h4>
                <p className="text-gray-600 text-sm">{proposal.descricao}</p>
              </div>
               <div>
                <h4 className="font-semibold text-gray-700">Disciplina:</h4>
                <p className="text-sm text-gray-600">{proposal.disciplina.nome}</p>
              </div>
               {proposal.comentariosAvaliador && (
                 <div>
                    <h4 className="font-semibold text-gray-700">Feedback do Avaliador:</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md border">{`"${proposal.comentariosAvaliador}"`}</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-dark"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailModal;