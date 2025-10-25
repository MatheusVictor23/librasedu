// apps/web/src/components/SignCard.jsx
import React, { useState } from 'react';
import { Play, Heart, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

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

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const videoId = getYouTubeVideoId(youtubeUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  const handleCardClick = () => {
    navigate(`/sinal/${id}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();

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
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-brand-blue/30"
      onClick={handleCardClick}
    >
      <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
        {thumbnailUrl ? (
          <>
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center">
            <Play size={56} className="text-white/80" />
          </div>
        )}
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
            <Play size={32} className="text-brand-blue ml-1" fill="currentColor" />
          </div>
        </div>

        {category && (
          <div className="absolute top-3 left-3">
            <span className="bg-brand-blue/95 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              {category}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-4 min-h-[65px]">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight text-lg group-hover:text-brand-blue transition-colors duration-300">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {author && (
          <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center mr-3 shadow-md">
              <span className="text-white font-semibold text-sm">
                {author.nome ? author.nome.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {author.nome || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500">Contribuidor</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-2">
          <button 
            onClick={handleLike}
            className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex-1 ${
              isLiked 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md hover:shadow-lg scale-105' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Heart 
              size={18} 
              className={`transition-all duration-300 ${isLiked ? 'fill-current' : ''}`} 
            />
            <span>{likeCount}</span>
          </button>

          <button 
            onClick={handleSave}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isSaved 
                ? 'bg-gradient-to-r from-blue-500 to-brand-blue text-white shadow-md hover:shadow-lg scale-105' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Bookmark 
              size={18} 
              className={`transition-all duration-300 ${isSaved ? 'fill-current' : ''}`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignCard;