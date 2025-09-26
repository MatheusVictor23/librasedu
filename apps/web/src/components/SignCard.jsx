// [INÍCIO DO CÓDIGO]
import React, { useState } from 'react';
import { Play, Heart, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Função para extrair o ID do vídeo do YouTube
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Componente do Modal de Vídeo
const VideoModal = ({ videoId, title, onClose }) => {
  if (!videoId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const SignCard = ({ sign }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    id,
    nome: title,
    youtubeUrl, // CORREÇÃO AQUI: 'videoUrl' foi alterado para 'youtubeUrl'
    descricao: description,
    // A 'categoria' agora pode vir de sinal.disciplina.nome
    disciplina, // Objeto disciplina
    sinalProposto, // Objeto sinalProposto para obter o proponente
    createdAt,
    _count: { SinalFavorito: likes } = { SinalFavorito: 0 }
  } = sign || {};

  // Extrai o nome do autor e categoria de forma segura
  const author = sinalProposto?.proposer; // Usa o proposer dentro de sinalProposto
  const category = disciplina?.nome; // Usa o nome da disciplina como categoria

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const videoId = getYouTubeVideoId(youtubeUrl); // Usa a variável corrigida
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const handleCardClick = () => {
    navigate(`/sinal/${id}`);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
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
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
            onClick={handleCardClick}
        >
          <div className="relative aspect-video bg-gray-200 flex items-center justify-center overflow-hidden">
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-brand-blue flex items-center justify-center">
                <Play size={48} className="text-white" />
              </div>
            )}
            
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="bg-white/90 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <Play size={32} className="text-brand-blue ml-1" />
              </div>
            </div>

            {/* Badge da categoria */}
            {category && (
              <div className="absolute top-3 left-3">
                <span className="bg-brand-blue/90 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                  {category}
                </span>
              </div>
            )}

            <button
              onClick={handlePlay}
              className="absolute top-3 right-3 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              title="Reproduzir vídeo"
            >
              <Play size={16} className="text-brand-blue ml-0.5" />
            </button>
          </div>

          <div className="p-4">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">{title}</h3>
              {description && (
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{description}</p>
              )}
            </div>

            {/* Informações do autor */}
            {author && (
              <div className="flex items-center mb-3 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center mr-3">
                  <span className="text-brand-blue font-medium text-sm">
                    {author.nome ? author.nome.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {author.nome || 'Usuário'}
                  </p>
                  {createdAt && (
                    <p className="text-xs text-gray-500">
                      {formatDate(createdAt)}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isLiked 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart size={16} className={`transition-all duration-200 ${isLiked ? 'fill-current scale-110' : ''}`} />
                <span>{likeCount}</span>
              </button>

              <button 
                onClick={handleSave}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isSaved 
                    ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark size={16} className={`transition-all duration-200 ${isSaved ? 'fill-current scale-110' : ''}`} />
              </button>
            </div>
          </div>
        </div>
    </>
  );
};

export default SignCard;
// [FIM DO CÓDIGO]