import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import UserProfileCard from '../components/UserProfileCard';
import StatCard from '../components/StatCard';
import ProposalDetailModal from '../components/ProposalDetailModal';
import { useAuth } from '../context/AuthContext';
import { Trophy, Key, Bookmark, Send, CheckCircle, XCircle, Clock, Edit, Save } from 'lucide-react';
import api from '../api/axiosConfig';

// Componente para renderizar a lista de propostas de forma interativa
const ProposalList = ({ proposals, onProposalClick }) => {
  if (!proposals || proposals.length === 0) {
    return <p className="text-gray-500 text-sm">Nenhuma proposta encontrada.</p>;
  }

  const statusIcons = {
    PENDENTE: <Clock size={16} className="text-yellow-500" />,
    APROVADO: <CheckCircle size={16} className="text-green-500" />,
    REJEITADO: <XCircle size={16} className="text-red-500" />,
  };

  return (
    <ul className="space-y-3">
      {proposals.slice(0, 5).map(proposal => (
        <li 
            key={proposal.id} 
            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => onProposalClick(proposal.id)}
        >
          <span className="text-gray-700 font-medium">{proposal.nome}</span>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {statusIcons[proposal.status]}
            <span>{proposal.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

// Componente para renderizar a lista de sinais salvos
const SavedList = ({ saved }) => {
  if (!saved || saved.length === 0) {
    return <p className="text-gray-500 text-sm">Nenhum sinal salvo.</p>;
  }

  return (
    <ul className="space-y-3">
      {saved.slice(0, 5).map(item => (
        <li key={item.sinal.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
          <Bookmark size={16} className="text-blue-500" />
          <span className="text-gray-700 font-medium">{item.sinal.nome}</span>
        </li>
      ))}
    </ul>
  );
};


const ProfilePage = () => {
  const { user, updateAuthUser } = useAuth(); // Pega a nova função do contexto
  
  const [userStats, setUserStats] = useState({ submitted: 0, approved: 0, rejected: 0, pending: 0, ranking: null });
  const [submittedProposals, setSubmittedProposals] = useState([]);
  const [savedSigns, setSavedSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NOVO: Estados para controlar a edição do perfil
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nome: user?.nome || '' });
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // Sincroniza o formulário com os dados do usuário, caso eles mudem
  useEffect(() => {
    setFormData({ nome: user?.nome || '' });
  }, [user]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const [statsRes, proposalsRes, savedRes] = await Promise.all([
            api.get('/users/me/stats'),
            api.get('/users/me/proposals'),
            api.get('/users/me/favorites')
          ]);
          setUserStats(statsRes.data);
          setSubmittedProposals(proposalsRes.data);
          setSavedSigns(savedRes.data);
        } catch (error) {
          console.error("Erro ao buscar dados do perfil:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfileData();
  }, [user]);

  const handleProposalClick = async (proposalId) => {
    try {
        const response = await api.get(`/sinais-propostos/${proposalId}`);
        setSelectedProposal(response.data);
        setIsModalOpen(true);
    } catch (error) {
        console.error("Erro ao buscar detalhes da proposta:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  }

  // NOVO: Funções para o formulário de edição
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });
    
    try {
        const response = await api.put('/users/profile', formData);
        updateAuthUser(response.data); // Atualiza o usuário no contexto global
        setFormMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        setIsEditing(false); // Retorna ao modo de visualização
    } catch (error) {
        console.error("Erro ao atualizar o perfil:", error);
        setFormMessage({ type: 'error', text: 'Não foi possível atualizar o perfil.' });
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    setFormMessage({ type: '', text: '' }); // Limpa mensagens ao alternar
  };
  
  const handleChangePassword = () => console.log('Change password clicked');

  return (
    <>
      {isModalOpen && <ProposalDetailModal proposal={selectedProposal} onClose={handleCloseModal} />}
      
      <MainLayout variant="simple">
        <div className="container mx-auto max-w-6xl px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                <div className="lg:col-span-1">
                    <UserProfileCard user={user} onEditProfile={handleToggleEdit} />
                    {formMessage.text && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {formMessage.text}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 space-y-8">
                {isEditing ? (
                  // MODO DE EDIÇÃO
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
                    <form onSubmit={handleSaveChanges}>
                       <div className="mb-4">
                          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                          <input 
                            type="text" 
                            name="nome"
                            id="nome"
                            value={formData.nome}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                       </div>
                       <div className="mb-6">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input 
                            type="email" 
                            name="email"
                            id="email"
                            value={user.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                          />
                       </div>
                       <div className="flex items-center space-x-4">
                          <button type="submit" className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                            <Save size={16} className="mr-2" />
                            Salvar Alterações
                          </button>
                          <button type="button" onClick={handleToggleEdit} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
                            Cancelar
                          </button>
                       </div>
                    </form>
                  </div>
                ) : loading ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p>A carregar perfil...</p>
                    </div>
                    ) : (
                    // MODO DE VISUALIZAÇÃO
                    <>
                        <div className="bg-gradient-to-r from-blue-500 to-brand-blue rounded-lg p-6 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Posição no Ranking</h3>
                              <div className="flex items-baseline">
                                <span className="text-4xl font-bold">#{userStats.ranking || 'N/A'}</span>
                              </div>
                              <p className="text-blue-100 mt-2">Continue a contribuir para subir no ranking!</p>
                            </div>
                            <Trophy size={48} className="text-yellow-300" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <StatCard type="submitted" value={userStats.submitted} label="Sinais Submetidos" />
                          <StatCard type="approved" value={userStats.approved} label="Sinais Aprovados" />
                          <StatCard type="rejected" value={userStats.rejected} label="Sinais Recusados" />
                          <StatCard type="pending" value={userStats.pending} label="Sinais Pendentes" />
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 text-brand-text-primary space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Send size={20} />
                                <span>Minhas Propostas Recentes</span>
                                </h3>
                                <ProposalList proposals={submittedProposals} onProposalClick={handleProposalClick} />
                            </div>
                            <hr/>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Bookmark size={20} />
                                <span>Sinais Salvos Recentes</span>
                                </h3>
                                <SavedList saved={savedSigns} />
                            </div>
                            <hr/>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Trocar Senha</h3>
                                <p className="text-gray-600 text-sm mb-4">Altere a sua senha para manter a sua conta segura.</p>
                                <button 
                                onClick={handleChangePassword}
                                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                >
                                <Key size={16} />
                                <span>Alterar senha</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
                </div>
            </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
