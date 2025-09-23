// src/pages/SignDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2, Play, ChevronDown, User } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const SignDetailPage = () => {
  const { id } = useParams();
  const [sign, setSign] = useState(null);
  const [relatedSigns, setRelatedSigns] = useState([]);
  const [authorSigns, setAuthorSigns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tecnologia e Computação');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Mock data - em produção viria da API
  useEffect(() => {
    // Simular carregamento dos dados do sinal
    const mockSign = {
      id: id,
      nome: 'Sinais básicos da libras',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoThumbnail: '/api/placeholder/600/400',
      descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
      significado: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
      areaConhecimento: 'Tecnologia e Computação',
      autor: {
        id: 1,
        nome: 'Helena Silva',
        avatar: '/api/placeholder/40/40',
        tipo: 'Intérprete',
        verificado: true
      },
      publicadoEm: '2 semanas',
      avaliacoes: [
        {
          id: 1,
          avaliador: 'Dr. João Santos',
          comentario: 'Excelente demonstração dos sinais básicos. Muito clara e didática.',
          data: '1 semana atrás'
        }
      ]
    };

    const mockAuthorSigns = [
      {
        id: 2,
        nome: 'Banco de dados',
        thumbnail: '/api/placeholder/200/150',
        categoria: 'Tecnologia e Computação'
      },
      {
        id: 3,
        nome: 'Programação',
        thumbnail: '/api/placeholder/200/150',
        categoria: 'Tecnologia e Computação'
      },
      {
        id: 4,
        nome: 'Algoritmo',
        thumbnail: '/api/placeholder/200/150',
        categoria: 'Tecnologia e Computação'
      }
    ];

    setSign(mockSign);
    setAuthorSigns(mockAuthorSigns);
  }, [id]);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleSave = () => {
    // Lógica para salvar/favoritar o sinal
    console.log('Sinal salvo');
  };

  const handleShare = () => {
    // Lógica para compartilhar o sinal
    console.log('Sinal compartilhado');
  };

  if (!sign) {
    return (
      <MainLayout>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">Carregando...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Botão Voltar */}
        <Link to="/sinais" className="inline-flex items-center text-brand-blue hover:text-brand-blue-dark mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Voltar para sinais
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Vídeo e Informações */}
          <div className="lg:col-span-2">
            {/* Vídeo */}
            <div className="relative bg-green-600 rounded-xl overflow-hidden mb-6 aspect-video">
              {!isVideoPlaying ? (
                <>
                  <img 
                    src={sign.videoThumbnail} 
                    alt={sign.nome}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <button 
                      onClick={handleVideoPlay}
                      className="bg-white/90 rounded-full p-4 hover:bg-white transition-colors"
                    >
                      <Play size={32} className="text-green-600 ml-1" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    4:01
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <p className="text-white">Player de vídeo seria carregado aqui</p>
                </div>
              )}
            </div>

            {/* Título e Ações */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{sign.nome}</h1>
              
              {/* Informações do Autor */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img 
                    src={sign.autor.avatar} 
                    alt={sign.autor.nome}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-900">{sign.autor.nome}</h3>
                      {sign.autor.verificado && (
                        <span className="ml-2 text-blue-500">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{sign.autor.tipo}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Bookmark size={16} />
                    <span>Salvar</span>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Share2 size={16} />
                    <span>Compartilhar</span>
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">Publicado há {sign.publicadoEm}</p>
            </div>

            {/* Comentários dos Avaliadores */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comentários dos avaliadores</h3>
              
              {sign.avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0 mb-4 last:mb-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{avaliacao.avaliador}</span>
                        <span className="text-sm text-gray-500">{avaliacao.data}</span>
                      </div>
                      <p className="text-gray-700">{avaliacao.comentario}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Direita */}
          <div className="lg:col-span-1">
            {/* Significado */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Significado</h3>
              <p className="text-gray-700">{sign.significado}</p>
            </div>

            {/* Área de Conhecimento */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Área de Conhecimento</h3>
              <p className="text-gray-700">{sign.areaConhecimento}</p>
            </div>

            {/* Outros Sinais do Autor */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Outros de {sign.autor.nome}</h3>
              </div>
              
              {/* Dropdown de Categoria */}
              <div className="mb-4">
                <div className="relative">
                  <button className="w-full bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center justify-between">
                    <span>Classificar por</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* Lista de Sinais */}
              <div className="space-y-4">
                <div className="bg-brand-blue text-white p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{selectedCategory}</h4>
                </div>
                
                {authorSigns.map((authorSign) => (
                  <Link 
                    key={authorSign.id} 
                    to={`/sinal/${authorSign.id}`}
                    className="block bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition-colors"
                  >
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
