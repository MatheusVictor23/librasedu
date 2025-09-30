import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import UserProfileCard from '../components/UserProfileCard';
import StatCard from '../components/StatCard';
import ProposalDetailModal from '../components/ProposalDetailModal';
import { useAuth } from '../context/AuthContext';
import { Trophy, Key, Bookmark, Send, CheckCircle, XCircle, Clock, Edit, Save, UserCircle, ShieldCheck } from 'lucide-react';
import api from '../api/axiosConfig';
import SolicitarVinculoForm from '../components/SolicitarVinculoForm';
import SolicitarInstituicaoForm from '../components/SolicitarInstituicaoForm';

// Componente ProposalList (sem alterações)
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

// Componente SavedList (sem alterações)
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
  // Renomeia 'loading' do AuthContext para evitar conflitos
  const { user, updateAuthUser, loading: authLoading } = useAuth();
  
  const [userStats, setUserStats] = useState({ submitted: 0, approved: 0, rejected: 0, pending: 0, ranking: null });
  const [submittedProposals, setSubmittedProposals] = useState([]);
  const [savedSigns, setSavedSigns] = useState([]);
  // Estado de loading específico para esta página
  const [pageLoading, setPageLoading] = useState(true);
  
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nome: user?.nome || '' });
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  
  const [vinculoView, setVinculoView] = useState('cta');

  // EFEITO 1: Busca o perfil mais recente do utilizador sempre que a página é visitada
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (user?.id) {
        try {
          const response = await api.get('/users/me');
          updateAuthUser(response.data); // Atualiza o estado global do utilizador
        } catch (error) {
          console.error("Erro ao buscar dados atualizados do utilizador:", error);
        }
      }
    };

    // Apenas executa depois do estado de autenticação inicial estar resolvido
    if (!authLoading) {
        fetchCurrentUser();
    }
  }, [authLoading, user?.id]); // Depende do ID do utilizador para re-executar se necessário

  // EFEITO 2: Busca as estatísticas DEPOIS que o 'user' do contexto for atualizado
  useEffect(() => {
    const fetchProfileStats = async () => {
      // Se não há vínculo, simplesmente para de carregar
      if (!user?.idInstituicao) {
        setPageLoading(false);
        return;
      }

      setPageLoading(true);
      try {
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
        setPageLoading(false);
      }
    };
    
    // Apenas executa se o user existir
    if (user) {
        fetchProfileStats();
    }
  }, [user]); // Este efeito crucial reage à mudança do 'user' no AuthContext

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
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarFile(null);
      setAvatarPreview('');
    }
  };
  
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });
    
    const submissionData = new FormData();
    submissionData.append('nome', formData.nome);
    if (avatarFile) {
      submissionData.append('avatar', avatarFile);
    }
    
    try {
        const response = await api.put('/users/profile', submissionData);
        updateAuthUser(response.data);
        setFormMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview('');
    } catch (error) {
        console.error("Erro ao atualizar o perfil:", error);
        setFormMessage({ type: 'error', text: 'Não foi possível atualizar o perfil.' });
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    setFormMessage({ type: '', text: '' });
    setAvatarFile(null);
    setAvatarPreview('');
  };
  
  const handleChangePassword = () => console.log('Change password clicked');

  if (authLoading || (pageLoading && user?.idInstituicao)) {
      return (
          <MainLayout variant="simple">
              <div className="text-center py-20">A carregar perfil...</div>
          </MainLayout>
      );
  }

  const UserDashboardContent = () => (
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
              <span>As minhas Propostas Recentes</span>
              </h3>
              <ProposalList proposals={submittedProposals} onProposalClick={handleProposalClick} />
          </div>
          <hr/>
          <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Bookmark size={20} />
              <span>Sinais Guardados Recentes</span>
              </h3>
              <SavedList saved={savedSigns} />
          </div>
          <hr/>
          <div>
              <h3 className="text-lg font-semibold text-gray-900">Alterar Senha</h3>
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
  );

  const VinculoFlowContent = () => {
    switch (vinculoView) {
      case 'vincular':
        return (
          <div>
            <SolicitarVinculoForm />
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                A sua instituição não está na lista?{' '}
                <button onClick={() => setVinculoView('cadastrar')} className="font-semibold text-brand-blue hover:underline">
                  Cadastre uma nova
                </button>
              </p>
            </div>
          </div>
        );
      case 'cadastrar':
        return (
          <div>
            <SolicitarInstituicaoForm />
            <div className="text-center mt-4">
              <button onClick={() => setVinculoView('vincular')} className="text-sm font-semibold text-gray-600 hover:underline">
                &larr; Voltar para a lista de instituições
              </button>
            </div>
          </div>
        );
      case 'cta':
      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShieldCheck size={48} className="mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Vínculo Institucional Necessário</h3>
            <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">
              Para poder submeter novos sinais e contribuir com o nosso glossário, é necessário que o seu perfil esteja verificado e vinculado a uma instituição de ensino ou pesquisa.
            </p>
            <button
              onClick={() => setVinculoView('vincular')}
              className="px-6 py-3 bg-brand-blue text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-dark transition-colors duration-300"
            >
              Iniciar Vinculação
            </button>
          </div>
        );
    }
  };

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
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
                  <form onSubmit={handleSaveChanges}>
                    <div className="flex flex-col items-center space-y-2 mb-6">
                      <label htmlFor="avatar-edit-upload" className="cursor-pointer">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
                        ) : user.avatarUrl ? (
                          <img src={`http://localhost:3000/${user.avatarUrl}`} alt={user.nome} className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                          <UserCircle size={96} className="text-gray-300" />
                        )}
                      </label>
                      <input id="avatar-edit-upload" name="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                      <label htmlFor="avatar-edit-upload" className="text-sm font-medium text-brand-blue hover:underline cursor-pointer">
                        Alterar foto
                      </label>
                    </div>
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
                        Guardar Alterações
                      </button>
                      <button type="button" onClick={handleToggleEdit} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  {user?.idInstituicao ? <UserDashboardContent /> : <VinculoFlowContent />}
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