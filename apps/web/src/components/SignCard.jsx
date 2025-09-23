// src/components/SignCard.jsx

import React, { useState } from 'react'; // CORREÇÃO: useState foi adicionado aqui
import { Play, Heart, Bookmark, X } from 'lucide-react';

// Função para extrair o ID do vídeo do YouTube de vários formatos de URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Componente do Modal para exibir o vídeo
const VideoModal = ({ videoId, title, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                    <X size={24} />
                </button>
            </div>
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                ></iframe>
            </div>
        </div>
    </div>
);


const SignCard = ({ sign }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    id,
    nome: title, // Renomeado para 'title' para manter consistência interna
    videoUrl,
    _count: { SinalFavorito: likes } = { SinalFavorito: 0 } // Extrai a contagem de favoritos
  } = sign || {};

  // Estados locais para simular o like/save (a lógica completa viria com a API de interação)
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const videoId = getYouTubeVideoId(videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  const handlePlay = (e) => {
    e.stopPropagation(); // Impede que o clique no botão de play propague para o card
    if (videoId) {
      setIsModalOpen(true);
    } else {
      alert("Link do vídeo inválido ou não disponível.");
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <>
        {isModalOpen && <VideoModal videoId={videoId} title={title} onClose={() => setIsModalOpen(false)} />}
        
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={handlePlay} // Clicar no card também abre o vídeo
        >
          <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              // Placeholder caso não consiga gerar a thumbnail
              <div className="w-full h-full bg-brand-blue flex items-center justify-center">
                <Play size={48} className="text-white" />
              </div>
            )}
            
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Play size={48} className="text-white" />
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 truncate">{title}</h3>
            
            <div className="flex items-center justify-between">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                <span>{likeCount}</span>
              </button>

              <button 
                onClick={handleSave}
                className={`p-2 rounded-full transition-colors ${
                  isSaved 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
        </div>
    </>
  );
};

export default SignCard;