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

  // Calcular tempo desde criação
  const getTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return 'Novo';
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    return null;
  };

  const timeAgo = getTimeAgo(createdAt);

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
      className="bg-brand-blue rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full flex flex-col transform hover:-translate-y-1"
      onClick={handleCardClick}
    >
      {/* Thumbnail do vídeo */}
      <div className="relative aspect-video bg-brand-blue-dark overflow-hidden">
        {thumbnailUrl ? (
          <>
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center">
            <Play size={56} className="text-white/50" />
          </div>
        )}
        
        {/* Ícone de Play no hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
            <Play size={28} className="text-brand-blue ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Tags superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {/* Tag da categoria */}
          {category && (
            <span className="bg-brand-blue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-white/20">
              {category}
            </span>
          )}
          
          {/* Badge "Novo" ou tempo */}
          {timeAgo && (
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              {timeAgo}
            </span>
          )}
        </div>

        {/* Badge de popularidade (se tiver muitas curtidas) */}
        {likeCount >= 10 && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Heart size={12} fill="currentColor" />
              <span>Popular</span>
            </div>
          </div>
        )}
      </div>

      {/* Informações do card */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Título e descrição */}
        <div className="mb-4 flex-1">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-blue-200 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
          
          {/* Linha decorativa */}
          <div className="mt-3 h-1 w-12 bg-gradient-to-r from-blue-300 to-transparent rounded-full opacity-50 group-hover:w-20 group-hover:opacity-100 transition-all duration-300"></div>
        </div>

        {/* Autor */}
        {author && (
          <div className="flex items-center mb-4 pb-4 border-b border-white/10">
            {author.fotoPerfil ? (
              <img 
                src={author.fotoPerfil} 
                alt={author.nome || 'Usuário'}
                className="w-9 h-9 rounded-full object-cover mr-3 ring-2 ring-white/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3 ring-2 ring-white/20">
                <span className="text-white font-bold text-sm">
                  {author.nome ? author.nome.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {author.nome || 'Usuário'}
              </p>
              <p className="text-xs text-white/60">Contribuidor</p>
            </div>
          </div>
        )}
        
        {/* Botões de ação */}
        <div className="flex items-center gap-2 mt-auto">
          <button 
            onClick={handleLike}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex-1 ${
              isLiked 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-pink-600 scale-100' 
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm hover:scale-105'
            }`}
          >
            <Heart 
              size={18} 
              className={`transition-all duration-300 ${isLiked ? 'fill-current animate-pulse' : ''}`} 
            />
            <span className="font-bold">{likeCount}</span>
          </button>

          <button 
            onClick={handleSave}
            className={`p-2.5 rounded-lg transition-all duration-300 hover:scale-105 ${
              isSaved 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-600' 
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
            }`}
            title={isSaved ? 'Remover dos salvos' : 'Salvar sinal'}
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