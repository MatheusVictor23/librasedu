import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, Play, ChevronDown, User } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import api from '../api/axiosConfig'; // Importa a instância configurada do Axios

const SignDetailPage = () => {
  const { id } = useParams();
  const [sign, setSign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Dados mockados para a seção "Outros Sinais", pois a API ainda não fornece isso.
  const [authorSigns, setAuthorSigns] = useState([
    { id: 2, nome: 'Banco de dados', categoria: 'Tecnologia e Computação' },
    { id: 3, nome: 'Programação', categoria: 'Tecnologia e Computação' },
    { id: 4, nome: 'Algoritmo', categoria: 'Tecnologia e Computação' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('Tecnologia e Computação');
  
  useEffect(() => {
    const fetchSignDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/sinais/${id}`);
        setSign(response.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do sinal:", err);
        setError("Não foi possível carregar o sinal. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchSignDetails();
  }, [id]);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  
  const videoId = getYouTubeVideoId(sign?.videoUrl);
  const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/api/placeholder/600/400';

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-6xl px-4 py-8 text-center">Carregando...</div>
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{sinalProposto?.proposer?.nome || 'Autor desconhecido'}</h3>
                    <p className="text-sm text-gray-600">{sinalProposto?.proposer?.instituicao?.nome || 'Instituição não informada'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Bookmark size={16} /> <span>Salvar</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Share2 size={16} /> <span>Compartilhar</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Publicado em: {new Date(sign.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comentários dos avaliadores</h3>
              {sinalProposto?.avaliador ? (
                <div className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0 mb-4 last:mb-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{sinalProposto.avaliador.nome}</span>
                        <span className="text-sm text-gray-500">{new Date(sinalProposto.updatedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <p className="text-gray-700">{sinalProposto.comentariosAvaliador || 'Sinal aprovado.'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Nenhum comentário de avaliação disponível.</p>
              )}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Outros de {sinalProposto?.proposer?.nome}</h3>
              <div className="mb-4 relative">
                <button className="w-full bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center justify-between">
                  <span>Classificar por</span> <ChevronDown size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-brand-blue text-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedCategory}</h4>
                </div>
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