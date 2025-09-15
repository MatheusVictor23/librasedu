import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Clock, User, GraduationCap, BookOpen, Building, Menu, Home, FileText, BarChart3, Settings, LogOut } from 'lucide-react';
import axios from 'axios';

const SinaisAvaliador = () => {
  const [sinais, setSinais] = useState([]);
  const [selectedSinal, setSelectedSinal] = useState(null);
  const [avaliado, setAvaliado] = useState(false);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('TODOS');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const loadSinais = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/sinais-propostos");
        setSinais(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar sinais:", err);
        setLoading(false);
      }
    };
    loadSinais();
  }, []);


// Extrai o ID de qualquer URL do YouTube
const getVideoId = (url) => {
  try {
    // Regex cobre youtube.com, youtu.be, shorts e URLs com parâmetros
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

const getYoutubeThumbnail = (url, quality = "hqdefault") => {
  const videoId = getVideoId(url);
  if (!videoId) return "";
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

  const handleAction = async (status) => {
    if (!selectedSinal) return;
    try {
      const res = await axios.put(
        `http://localhost:3000/api/sinais-propostos/${selectedSinal.id}`,
        {
          avaliadorId: 1,
          status,
          comentariosAvaliador: comentario,
        }
      );

      // Atualiza lista local
      setSinais((prev) =>
        prev.map((sinal) =>
          sinal.id === selectedSinal.id
            ? { ...sinal, status, comentariosAvaliador: comentario }
            : sinal
        )
      );

      alert(`Sinal ${status.toLowerCase()} com sucesso!`);
      setAvaliado(true);
      setSelectedSinal(null);
      setComentario("");
    } catch (err) {
      console.error("Erro ao atualizar sinal:", err);
      alert("Erro ao atualizar sinal");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDENTE: { color: 'bg-yellow-400', text: 'Pendente', icon: Clock },
      APROVADO: { color: 'bg-green-500', text: 'Aprovado', icon: CheckCircle },
      REPROVADO: { color: 'bg-red-500', text: 'Reprovado', icon: XCircle }
    };

    const config = statusConfig[status] || { color: 'bg-gray-500', text: status, icon: Clock };
    const Icon = config.icon;

    return (
      <div className={`${config.color} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
        <Icon size={12} />
        {config.text}
      </div>
    );
  };

  const filteredSinais = filter === 'TODOS' 
    ? sinais 
    : sinais.filter(sinal => sinal.status === filter);

  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: FileText, label: 'Sinais Propostos', active: false },
    { icon: BarChart3, label: 'Relatórios', active: false },
    { icon: Settings, label: 'Configurações', active: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sinais propostos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header do Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Avaliador</h2>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a
                    href="#"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      item.active 
                        ? 'bg-blue-100 text-brand-blue border-l-4 border-brand-blue' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Prof. Ana Silva</p>
                <p className="text-xs text-gray-500">Especialista em Libras</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut size={16} />
              <span>Sair</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-brand-blue text-white shadow-lg">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Avaliação de Sinais</h1>
                <p className="text-white text-sm">Sistema de Aprovação de Libras</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <p className="text-sm">Total de sinais: <span className="font-bold">{sinais.length}</span></p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {/* Filtros */}
          <div className="mb-6 flex flex-wrap gap-3 items-center">
            <h2 className="text-xl font-bold text-gray-800 mr-4">Sinais Propostos</h2>
            {['TODOS', 'PENDENTE', 'APROVADO', 'REPROVADO'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status 
                    ? 'bg-brand-blue text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {status === 'TODOS' ? 'Todos' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          {filteredSinais.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">Nenhum sinal encontrado</h3>
              <p className="text-gray-500">Não há sinais com o filtro selecionado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSinais.map(sinal => (
                <div
                  key={sinal.id}
                  className="relative shadow rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                  onClick={() => {
                    setSelectedSinal(sinal);
                    setComentario(sinal.comentariosAvaliador || "");
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={getYoutubeThumbnail(sinal.videoUrl)}
                    alt={sinal.nome}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggMTEyTDE3NiA4NlYxMzhMMTI4IDExMloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                    }}
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(sinal.status)}
                  </div>

                  <div className="p-4 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                      {sinal.nome}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {sinal.descricao}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <User size={12} className="mr-1" />
                      {sinal.proposer?.nome || 'Usuário desconhecido'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {selectedSinal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-gray-800">{selectedSinal.nome}</h2>
                {getStatusBadge(selectedSinal.status)}
              </div>
              <button
                onClick={() => setSelectedSinal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side - Video */}
              <div className="space-y-4">
                <iframe
                  className="w-full h-64 rounded-md mb-4"
                  src={`https://www.youtube.com/embed/${getVideoId(selectedSinal.videoUrl)}`}
                  title={selectedSinal.nome}
                  frameBorder="0"
                  allowFullScreen
                />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                  <p className="text-gray-700 text-justify">{selectedSinal.descricao}</p>
                </div>
              </div>

              {/* Right Side - Info and Evaluation */}
              <div className="space-y-4">
                {/* Informações do Sinal */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="text-brand-blue" size={18} />
                    <div>
                      <p className="font-medium text-gray-800">Área do Conhecimento</p>
                      {selectedSinal.disciplina?.curso?.areasConhecimento?.length > 1 ? (
                        <p className="text-gray-600 text-sm">{selectedSinal.disciplina?.curso?.areasConhecimento?.map((area) => area.nome).join(", ") || "Não informado"}</p>
                      ) : (
                        <p className="text-gray-600 text-sm">{selectedSinal.disciplina?.curso?.areasConhecimento?.[0].nome || "Não informado"}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="text-brand-blue" size={18} />
                    <div>
                      <p className="font-medium text-gray-800">Curso</p>
                      <p className="text-gray-600 text-sm">{selectedSinal.disciplina?.curso?.nome || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <BookOpen className="text-brand-blue" size={18} />
                    <div>
                      <p className="font-medium text-gray-800">Disciplina</p>
                      <p className="text-gray-600 text-sm">{selectedSinal.disciplina?.nome || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <User className="text-brand-blue" size={18} />
                    <div>
                      <p className="font-medium text-gray-800">Proposto por</p>
                      <p className="text-gray-600 text-sm">{selectedSinal.proposer?.nome || "Desconhecido"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Building className="text-brand-blue" size={18} />
                    <div>
                      <p className="font-medium text-gray-800">Instituição</p>
                      <p className="text-gray-600 text-sm">{selectedSinal.proposer?.instituicao?.nome || "Não informado"}</p>
                    </div>
                  </div>
                </div>

                {/* Comentários Anteriores */}
                {selectedSinal.comentariosAvaliador && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Comentário do avaliador</h4>
                    <p className="text-blue-700 text-sm">{selectedSinal.comentariosAvaliador}</p>
                  </div>
                )}

                {/* Campo comentário */}
                {avaliado == false && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentários da Avaliação
                      </label>
                      <textarea
                        placeholder="Adicione comentários..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAction("APROVADO")}
                        className="flex-1 bg-brand-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-brand-blue-dark transition-colors flex items-center justify-center space-x-2"
                      >
                        <CheckCircle size={18} />
                        <span>Aprovar</span>
                      </button>
                      <button
                        onClick={() => handleAction("REPROVADO")}
                        className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <XCircle size={18} />
                        <span>Rejeitar</span>
                      </button>
                    </div>
                  </>
                )}


              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SinaisAvaliador;