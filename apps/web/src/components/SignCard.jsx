// apps/web/src/components/SignCard.jsx
import React, { useState } from 'react';
import { Play, Heart, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Importar a instância do Axios

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const SignCard = ({ sign }) => {
  const navigate = useNavigate();

  if (!sign) return null;

  const {
    id,
    nome: title,
    youtubeUrl,
    descricao: description,
    disciplina,
    sinalProposto,
    createdAt,
    _count: { curtidas: initialLikes } = { curtidas: 0 },
    isLiked: initialIsLiked,
    isSaved: initialIsSaved,
  } = sign;

  const author = sinalProposto?.proposer;
  const category = disciplina?.nome;

  // Estados locais para interatividade instantânea
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const videoId = getYouTubeVideoId(youtubeUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  const handleCardClick = () => {
    navigate(`/sinal/${id}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation(); // Impede que o clique no botão propague para o card

    // Atualização otimista da UI
    const originalIsLiked = isLiked;
    const originalLikeCount = likeCount;

    setIsLiked(!originalIsLiked);
    setLikeCount(originalIsLiked ? originalLikeCount - 1 : originalLikeCount + 1);

    try {
      if (originalIsLiked) {
        await api.delete(`/sinais/${id}/like`);
      } else {
        await api.post(`/sinais/${id}/like`);
      }
    } catch (error) {
      console.error("Erro ao curtir o sinal:", error);
      // Reverte a UI em caso de erro na API
      setIsLiked(originalIsLiked);
      setLikeCount(originalLikeCount);
      alert('Ocorreu um erro. Tente novamente.');
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();

    const originalIsSaved = isSaved;
    setIsSaved(!originalIsSaved);

    try {
      if (originalIsSaved) {
        await api.delete(`/sinais/${id}/save`);
      } else {
        await api.post(`/sinais/${id}/save`);
      }
    } catch (error) {
      console.error("Erro ao guardar o sinal:", error);
      setIsSaved(originalIsSaved);
      alert('Ocorreu um erro. Tente novamente.');
    }
  };
  
  return (
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

        {category && (
          <div className="absolute top-3 left-3">
            <span className="bg-brand-blue/90 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3 min-h-[60px]">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{description}</p>
          )}
        </div>

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
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bookmark size={16} className={`transition-all duration-200 ${isSaved ? 'fill-current scale-110' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignCard;