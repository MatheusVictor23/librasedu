// apps/web/src/pages/SignDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, Play, Heart, User, MessageSquare, Send, Calendar, AlertCircle, FileText, Tag } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const SignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sign, setSign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [comentarioLoading, setComentarioLoading] = useState(false);

  const [recommendedSigns, setRecommendedSigns] = useState([]);
  
  const fetchSignDetails = async () => {
    setLoading(true);
    try {
      const [signRes, comentariosRes, recommendedRes] = await Promise.all([
        api.get(`/sinais/${id}`),
        api.get(`/sinais/${id}/comentarios`),
        api.get('/sinais/recommended')
      ]);
      
      const fetchedSign = signRes.data;
      setSign(fetchedSign);
      setComentarios(comentariosRes.data);
      
      // Filtrar recomendações para não incluir o sinal atual
      const filteredRecommended = recommendedRes.data.filter(s => s.id !== parseInt(id, 10));
      setRecommendedSigns(filteredRecommended.slice(0, 6));

      setIsLiked(fetchedSign.isLiked);
      setLikeCount(fetchedSign._count?.curtidas || 0);
      setIsSaved(fetchedSign.isSaved);

    } catch (err) {
      console.error("Erro ao buscar detalhes do sinal:", err);
      setError("Não foi possível carregar o sinal. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignDetails();
  }, [id]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  
  const videoId = getYouTubeVideoId(sign?.youtubeUrl);
  const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/api/placeholder/600/400';

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleLike = async () => {
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
      alert('Ocorreu um erro ao curtir/descurtir. Tente novamente.');
    }
  };

  const handleSave = async () => {
    const originalIsSaved = isSaved;
    setIsSaved(!originalIsSaved);

    try {
      if (originalIsSaved) {
        await api.delete(`/sinais/${id}/save`);
      } else {
        await api.post(`/sinais/${id}/save`);
      }
    } catch (error) {
      console.error("Erro ao salvar o sinal:", error);
      setIsSaved(originalIsSaved);
      alert('Ocorreu um erro ao guardar/desguardar. Tente novamente.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;
    
    setComentarioLoading(true);
    try {
      const response = await api.post(`/sinais/${id}/comentarios`, { texto: novoComentario });
      setComentarios([response.data, ...comentarios]);
      setNovoComentario('');
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      alert('Não foi possível enviar o seu comentário.');
    } finally {
      setComentarioLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: sign.nome,
        text: sign.descricao,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };
  
  if (loading) {
    return (
      <MainLayout variant="user">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mb-4"></div>
            <p className="text-center text-brand-text-secondary">A carregar...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout variant="user">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6">
            <div className="flex items-start">
              <AlertCircle size={24} className="text-red-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Erro ao carregar</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="mt-3 text-sm text-red-700 hover:text-red-800 font-medium underline"
                >
                  Voltar ao painel
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!sign) {
    return (
      <MainLayout variant="user">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-brand-text-secondary">Sinal não encontrado.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 text-sm text-brand-blue hover:text-brand-blue-dark font-medium underline"
            >
              Voltar ao painel
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { sinalProposto } = sign;

  return (
    <MainLayout variant="user">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-brand-blue hover:text-brand-blue-dark mb-6 transition-colors font-medium group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna Principal - Desktop: Esquerda (2/3) | Mobile: Ordem controlada */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Vídeo - Sempre primeiro */}
            <div className="relative bg-brand-blue rounded-xl overflow-hidden shadow-md aspect-video group">
              {isVideoPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title={sign.nome}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <>
                  <img src={videoThumbnail} alt={sign.nome} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={handleVideoPlay} 
                      className="bg-white/95 backdrop-blur-sm rounded-full p-5 hover:bg-white hover:scale-110 transition-all duration-300 shadow-xl group-hover:scale-105"
                    >
                      <Play size={36} className="text-brand-blue ml-1" fill="currentColor" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Info do Sinal - Sempre segundo */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h1 className="text-2xl lg:text-3xl font-bold text-brand-text-primary mb-4">
                {sign.nome}
              </h1>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {sinalProposto?.proposer?.avatarUrl ? (
                    <img 
                      src={`http://localhost:3000/${sinalProposto.proposer.avatarUrl}`} 
                      alt={sinalProposto.proposer.nome} 
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-blue/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center ring-2 ring-brand-blue/20">
                      <User size={22} className="text-brand-blue" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-brand-text-primary">
                      {sinalProposto?.proposer?.nome || 'Autor desconhecido'}
                    </h3>
                    <p className="text-sm text-brand-text-secondary">
                      {sinalProposto?.proposer?.instituicao?.nome || 'Instituição não informada'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <button 
                    onClick={handleLike} 
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold shadow-sm ${
                      isLiked 
                        ? 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md' 
                        : 'bg-gray-100 text-brand-text-primary hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    <Heart size={18} className={`${isLiked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                  
                  <button 
                    onClick={handleSave} 
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold shadow-sm ${
                      isSaved 
                        ? 'bg-brand-blue text-white hover:bg-brand-blue-dark hover:shadow-md' 
                        : 'bg-gray-100 text-brand-text-primary hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    <Bookmark size={18} className={`${isSaved ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">{isSaved ? 'Salvo' : 'Salvar'}</span>
                  </button>
                  
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-sm font-semibold text-brand-text-primary border border-gray-200 shadow-sm hover:shadow-md"
                  >
                    <Share2 size={18} />
                    <span className="hidden sm:inline">Compartilhar</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-brand-text-secondary">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-brand-blue" />
                  <span>{new Date(sign.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-brand-blue" />
                  <span>{likeCount} curtidas</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-brand-blue" />
                  <span>{comentarios.length} comentários</span>
                </div>
              </div>
            </div>

            {/* Descrição - Mobile: terceiro | Desktop: hidden */}
            <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <FileText size={20} className="text-brand-blue" />
                <span>Descrição</span>
              </h3>
              <p className="text-brand-text-secondary text-sm leading-relaxed">
                {sign.descricao}
              </p>
            </div>

            {/* Disciplina - Mobile: quarto | Desktop: hidden */}
            <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <Tag size={20} className="text-brand-blue" />
                <span>Disciplina</span>
              </h3>
              <span className="inline-block bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">
                {sign.disciplina.nome}
              </span>
            </div>

            {/* Recomendações - Mobile: quinto | Desktop: hidden */}
            <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-text-primary mb-4">
                Sinais Recomendados
              </h3>
              <div className="space-y-3">
                {recommendedSigns.length > 0 ? recommendedSigns.map((recommendedSign) => (
                  <button
                    key={recommendedSign.id}
                    onClick={() => navigate(`/sinal/${recommendedSign.id}`)}
                    className="w-full block bg-gray-50 rounded-lg p-3 hover:bg-brand-blue/5 hover:border-brand-blue/30 transition-all border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 bg-brand-blue rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Play size={18} className="text-white ml-0.5" fill="currentColor" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h5 className="font-semibold text-brand-text-primary text-sm truncate">
                          {recommendedSign.nome}
                        </h5>
                        <p className="text-xs text-brand-text-secondary truncate">
                          {recommendedSign.disciplina?.nome || 'Sem disciplina'}
                        </p>
                      </div>
                    </div>
                  </button>
                )) : (
                  <p className="text-center text-brand-text-secondary text-sm py-4">
                    Nenhum sinal recomendado no momento.
                  </p>
                )}
              </div>
            </div>
            
            {/* Comentários - Mobile: sexto (último) | Desktop: terceiro */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-text-primary mb-5 flex items-center gap-2">
                <MessageSquare size={22} className="text-brand-blue" />
                <span>Comentários ({comentarios.length})</span>
              </h3>

              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex gap-3">
                  {user?.avatarUrl ? (
                    <img 
                      src={`http://localhost:3000/${user.avatarUrl}`} 
                      alt={user.nome} 
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200">
                      <User size={18} className="text-brand-blue" />
                    </div>
                  )}
                  <div className="flex-1">
                    <textarea
                      value={novoComentario}
                      onChange={(e) => setNovoComentario(e.target.value)}
                      placeholder="Adicione um comentário..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none text-brand-text-primary placeholder-gray-400"
                      rows="3"
                      disabled={comentarioLoading}
                    />
                    <button 
                      type="submit" 
                      disabled={comentarioLoading || !novoComentario.trim()} 
                      className="mt-2 px-5 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-lg hover:bg-brand-blue-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      {comentarioLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>A enviar...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Comentar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-3">
                {comentarios.length > 0 ? comentarios.map(comentario => (
                  <div key={comentario.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100">
                    {comentario.usuario.avatarUrl ? (
                      <img 
                        src={`http://localhost:3000/${comentario.usuario.avatarUrl}`} 
                        alt={comentario.usuario.nome} 
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                        <User size={18} className="text-brand-blue" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-brand-text-primary">
                          {comentario.usuario.nome}
                        </span>
                        <span className="text-xs text-brand-text-secondary">
                          {new Date(comentario.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-brand-text-secondary leading-relaxed">
                        {comentario.texto}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <MessageSquare size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-brand-text-secondary text-sm font-medium mb-1">
                      Nenhum comentário ainda
                    </p>
                    <p className="text-gray-400 text-xs">
                      Seja o primeiro a comentar sobre este sinal!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Desktop: Direita (1/3) | Mobile: hidden */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            
            {/* Descrição - Desktop only */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <FileText size={20} className="text-brand-blue" />
                <span>Descrição</span>
              </h3>
              <p className="text-brand-text-secondary text-sm leading-relaxed">
                {sign.descricao}
              </p>
            </div>

            {/* Disciplina - Desktop only */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-text-primary mb-3 flex items-center gap-2">
                <Tag size={20} className="text-brand-blue" />
                <span>Disciplina</span>
              </h3>
              <span className="inline-block bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm">
                {sign.disciplina.nome}
              </span>
            </div>

            {/* Recomendações - Desktop only */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-text-primary mb-4">
                Sinais Recomendados
              </h3>
              <div className="space-y-3">
                {recommendedSigns.length > 0 ? recommendedSigns.map((recommendedSign) => (
                  <button
                    key={recommendedSign.id}
                    onClick={() => navigate(`/sinal/${recommendedSign.id}`)}
                    className="w-full block bg-gray-50 rounded-lg p-3 hover:bg-brand-blue/5 hover:border-brand-blue/30 transition-all border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 bg-brand-blue rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Play size={18} className="text-white ml-0.5" fill="currentColor" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h5 className="font-semibold text-brand-text-primary text-sm truncate">
                          {recommendedSign.nome}
                        </h5>
                        <p className="text-xs text-brand-text-secondary truncate">
                          {recommendedSign.disciplina?.nome || 'Sem disciplina'}
                        </p>
                      </div>
                    </div>
                  </button>
                )) : (
                  <p className="text-center text-brand-text-secondary text-sm py-4">
                    Nenhum sinal recomendado no momento.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignDetailPage;