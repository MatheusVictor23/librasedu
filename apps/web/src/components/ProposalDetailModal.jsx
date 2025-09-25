// src/components/ProposalDetailModal.jsx

import React from 'react';
import { X, Clock, CheckCircle, XCircle } from 'lucide-react';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const videoIdMatch = url.match(/(?:v=|\/embed\/|\.be\/)([\w-]{11})/);
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : '';
};

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

  const videoEmbedUrl = getYouTubeEmbedUrl(proposal.videoUrl);

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
            <div className="w-full">
              {videoEmbedUrl ? (
                <div className="relative" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={videoEmbedUrl}
                    title={`Vídeo para ${proposal.nome}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  ></iframe>
                </div>
              ) : <p className="text-sm text-gray-500">Link do vídeo inválido.</p>}
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
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md border">{proposal.comentariosAvaliador}</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center p-4 border-t">
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