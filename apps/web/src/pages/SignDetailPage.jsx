// apps/web/src/pages/SignDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// 1. Adicionado MessageSquare para o ícone de comentários
import { ArrowLeft, Bookmark, Share2, Play, Heart, User, ChevronDown, MessageSquare } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext'; // 2. Importado useAuth para pegar o user atual

const SignDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth(); // Obter o utilizador autenticado para a foto de perfil
  const [sign, setSign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Estados para likes e saves
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // NOVO: Estados para comentários
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [comentarioLoading, setComentarioLoading] = useState(false);

  // Dados mockados para a seção "Outros Sinais", pois a API ainda não fornece isso.
  // Em uma implementação real, você buscaria sinais do mesmo proponente ou categoria.
  const [authorSigns, setAuthorSigns] = useState([
    { id: 2, nome: 'Banco de dados', categoria: 'Tecnologia e Computação' },
    { id: 3, nome: 'Programação', categoria: 'Tecnologia e Computação' },
    { id: 4, nome: 'Algoritmo', categoria: 'Tecnologia e Computação' }
  ]);
  
  // Função para buscar todos os dados do sinal e comentários
  const fetchSignDetails = async () => {
    setLoading(true);
    try {
      const [signRes, comentariosRes] = await Promise.all([
        api.get(`/sinais/${id}`),
        api.get(`/sinais/${id}/comentarios`)
      ]);
      
      const fetchedSign = signRes.data;
      setSign(fetchedSign);
      setComentarios(comentariosRes.data); // Define os comentários

      // Inicializa os estados de interação com os dados da API
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
  }, [id]); // Depende do ID do sinal para refetch

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
      console.error("Erro ao guardar o sinal:", error);
      setIsSaved(originalIsSaved);
      alert('Ocorreu um erro ao guardar/desguardar. Tente novamente.');
    }
  };

  // NOVO: Handler para submeter um novo comentário
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return; // Não envia comentários vazios
    
    setComentarioLoading(true);
    try {
      const response = await api.post(`/sinais/${id}/comentarios`, { texto: novoComentario });
      // Adiciona o novo comentário no topo da lista para uma atualização instantânea da UI
      setComentarios([response.data, ...comentarios]);
      setNovoComentario(''); // Limpa o campo de texto
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      alert('Não foi possível enviar o seu comentário.');
    } finally {
      setComentarioLoading(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-6xl px-4 py-8 text-center">A carregar...</div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-6xl px-4 py-8 text-center text-red-500">{error}</div>
      </MainLayout>
    );
  }

  if (!sign) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-6xl px-4 py-8 text-center">Sinal não encontrado.</div>
      </MainLayout>
    );
  }

  const { sinalProposto } = sign;

  return (
    <MainLayout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Link to="/dashboard" className="inline-flex items-center text-brand-blue hover:text-brand-blue-dark mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Voltar para o painel
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6 aspect-video">
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
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <button onClick={handleVideoPlay} className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors">
                      <Play size={32} className="text-brand-blue ml-1" />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{sign.nome}</h1>
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                   {/* 3. Renderiza o avatar do proponente */}
                   {sinalProposto?.proposer?.avatarUrl ? (
                        <img src={`http://localhost:3000/${sinalProposto.proposer.avatarUrl}`} alt={sinalProposto.proposer.nome} className="w-10 h-10 rounded-full object-cover mr-3" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User size={20} className="text-gray-600" />
                        </div>
                    )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{sinalProposto?.proposer?.nome || 'Autor desconhecido'}</h3>
                    <p className="text-sm text-gray-600">{sinalProposto?.proposer?.instituicao?.nome || 'Instituição não informada'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={handleLike} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${isLiked ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <Heart size={16} className={`${isLiked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                  <button onClick={handleSave} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${isSaved ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <Bookmark size={16} className={`${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium">
                    <Share2 size={16} /> <span>Partilhar</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Publicado em: {new Date(sign.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            {/* --- NOVA SECÇÃO DE COMENTÁRIOS --- */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare size={20} /> Comentários ({comentarios.length})
                </h3>

                {/* Formulário para novo comentário */}
                <form onSubmit={handleCommentSubmit} className="flex items-start space-x-4 mb-6">
                    {/* Renderiza o avatar do utilizador logado para o formulário de comentário */}
                    {user?.avatarUrl ? (
                        <img src={`http://localhost:3000/${user.avatarUrl}`} alt={user.nome} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={20} className="text-gray-600" />
                        </div>
                    )}
                    <div className="flex-1">
                        <textarea
                            value={novoComentario}
                            onChange={(e) => setNovoComentario(e.target.value)}
                            placeholder="Adicione um comentário..."
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                            rows="2"
                            disabled={comentarioLoading} // Desabilita enquanto envia
                        />
                        <button type="submit" disabled={comentarioLoading} className="mt-2 px-4 py-2 bg-brand-blue text-white text-sm font-semibold rounded-md hover:bg-brand-blue-dark disabled:bg-gray-400">
                            {comentarioLoading ? 'A enviar...' : 'Comentar'}
                        </button>
                    </div>
                </form>

                {/* Lista de comentários */}
                <div className="space-y-4">
                    {comentarios.length > 0 ? comentarios.map(comentario => (
                        <div key={comentario.id} className="flex items-start space-x-4">
                            {/* Renderiza o avatar do autor do comentário */}
                            {comentario.usuario.avatarUrl ? (
                                <img src={`http://localhost:3000/${comentario.usuario.avatarUrl}`} alt={comentario.usuario.nome} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={20} className="text-gray-600" />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{comentario.usuario.nome}</span>
                                    <span className="text-xs text-gray-500">{new Date(comentario.createdAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{comentario.texto}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-4">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                    )}
                </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
              <p className="text-gray-700">{sign.descricao}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Disciplina</h3>
              <p className="text-gray-700">{sign.disciplina.nome}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Outros de {sinalProposto?.proposer?.nome || 'Autor'}</h3>
              <div className="mb-4 relative">
                <button className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center justify-between hover:bg-gray-200 transition-colors">
                  <span>Classificar por</span> <ChevronDown size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {/* Aqui você pode buscar sinais relacionados via API, se implementado */}
                {authorSigns.map((authorSign) => (
                  <Link key={authorSign.id} to={`/sinal/${authorSign.id}`} className="block bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-12 bg-gray-300 rounded flex items-center justify-center">
                        <Play size={16} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{authorSign.nome}</h5>
                        <p className="text-sm text-gray-600">{authorSign.categoria}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignDetailPage;