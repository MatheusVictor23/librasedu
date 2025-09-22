// src/components/SignCard.jsx

import React from 'react';
import { Play, Heart, Bookmark } from 'lucide-react';

const SignCard = ({ sign, showActions = true }) => {
  const {
    id,
    title = "Banco de dados",
    description = "Descrição do sinal",
    thumbnail,
    videoUrl,
    author,
    likes = 0,
    saves = 0,
    isLiked = false,
    isSaved = false
  } = sign || {};

  const handlePlay = () => {
    console.log('Play video:', videoUrl);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    console.log('Toggle like:', id);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    console.log('Toggle save:', id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-brand-blue flex items-center justify-center">
            <Play size={48} className="text-white" />
          </div>
        )}
        
        <button 
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity"
        >
          <Play size={48} className="text-white" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        
        {showActions && (
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
              <span>{likes}</span>
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
        )}

        {!showActions && (
          <button className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Ver detalhes
          </button>
        )}
      </div>
    </div>
  );
};

export default SignCard;

