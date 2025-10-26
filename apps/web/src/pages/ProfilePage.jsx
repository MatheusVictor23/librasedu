// apps/web/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import UserProfileCard from '../components/UserProfileCard';
import StatCard from '../components/StatCard';
import ProposalDetailModal from '../components/ProposalDetailModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { useAuth } from '../context/AuthContext';
import { Trophy, Key, Bookmark, Send, CheckCircle, XCircle, Clock, Edit, Save, UserCircle, ShieldCheck, Heart } from 'lucide-react';
import api from '../api/axiosConfig';
import SolicitarVinculoForm from '../components/SolicitarVinculoForm';
import SolicitarInstituicaoForm from '../components/SolicitarInstituicaoForm';

const ProposalList = ({ proposals, onProposalClick }) => {
  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center py-12 bg-blue-50/50 rounded-xl border-2 border-dashed border-blue-200">
        <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Send size={32} className="text-blue-300" />
        </div>
        <p className="text-brand-text-secondary font-medium">Nenhuma proposta encontrada.</p>
      </div>
    );
  }
  
  const statusIcons = {
    PENDENTE: <Clock size={16} className="text-yellow-600" />,
    APROVADO: <CheckCircle size={16} className="text-green-600" />,
    REJEITADO: <XCircle size={16} className="text-red-600" />,
  };
  
  const statusColors = {
    PENDENTE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    APROVADO: 'bg-green-100 text-green-700 border-green-200',
    REJEITADO: 'bg-red-100 text-red-700 border-red-200',
  };
  
  return (
    <ul className="space-y-3">
      {proposals.slice(0, 5).map(proposal => (
        <li 
          key={proposal.id} 
          className="flex justify-between items-center bg-white border-2 border-gray-100 p-4 rounded-xl hover:border-brand-blue hover:shadow-md cursor-pointer transition-all group"
          onClick={() => onProposalClick(proposal.id)}
        >
          <span className="text-brand-text-primary font-semibold text-sm group-hover:text-brand-blue transition-colors">{proposal.nome}</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${statusColors[proposal.status]}`}>
            {statusIcons[proposal.status]}
            <span>{proposal.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

const SavedList = ({ saved }) => {
  if (!saved || saved.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-blue-200">
        <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <Bookmark size={32} className="text-blue-300" />
        </div>
        <p className="text-brand-text-secondary font-medium">Nenhum sinal salvo.</p>
      </div>
    );
  }
  
  return (
    <ul className="space-y-3">
      {saved.slice(0, 5).map(item => (
        <li key={item.sinal.id}>
          <Link 
            to={`/sinal/${item.sinal.id}`} 
            className="flex items-center gap-3 bg-white border-2 border-blue-100 p-4 rounded-xl hover:border-brand-blue hover:shadow-md transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue transition-colors flex-shrink-0">
              <Bookmark size={16} className="text-brand-blue group-hover:text-white transition-colors" />
            </div>
            <span className="text-brand-text-primary font-semibold text-sm group-hover:text-brand-blue transition-colors">{item.sinal.nome}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const LikedList = ({ liked }) => {
  if (!liked || liked.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-red-200">
        <div className="w-16 h-16 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Heart size={32} className="text-red-300" />
        </div>
        <p className="text-brand-text-secondary font-medium">Nenhum sinal curtido.</p>
      </div>
    );
  }
  
  return (
    <ul className="space-y-3">
      {liked.slice(0, 5).map(item => (
        <li key={item.sinal.id}>
          <Link 
            to={`/sinal/${item.sinal.id}`} 
            className="flex items-center gap-3 bg-white border-2 border-red-100 p-4 rounded-xl hover:border-red-500 hover:shadow-md transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-500 transition-colors flex-shrink-0">
              <Heart size={16} className="text-red-500 fill-current group-hover:text-white transition-colors" />
            </div>
            <span className="text-brand-text-primary font-semibold text-sm group-hover:text-red-500 transition-colors">{item.sinal.nome}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const ProfilePage = () => {
  const { user, updateAuthUser, loading: authLoading } = useAuth();
  
  const [userStats, setUserStats] = useState({ submitted: 0, approved: 0, rejected: 0, pending: 0, ranking: null });
  const [submittedProposals, setSubmittedProposals] = useState([]);
  const [savedSigns, setSavedSigns] = useState([]);
  const [likedSigns, setLikedSigns] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nome: user?.nome || '' });
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [vinculoView, setVinculoView] = useState('cta');

  useEffect(() => {
    const fetchCoreData = async () => {
      if (!user?.id) {
        setPageLoading(false);
        return;
      }
      
      setPageLoading(true);
      try {
        const [savedRes, likedRes, currentUserRes] = await Promise.all([
          api.get('/users/me/saved'),
          api.get('/users/me/liked'),
          api.get('/users/me')
        ]);
        setSavedSigns(savedRes.data);
        setLikedSigns(likedRes.data);
        updateAuthUser(currentUserRes.data);

        if (currentUserRes.data.idInstituicao) {
          const [statsRes, proposalsRes] = await Promise.all([
            api.get('/users/me/stats'),
            api.get('/users/me/proposals')
          ]);
          setUserStats(statsRes.data);
          setSubmittedProposals(proposalsRes.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      } finally {
        setPageLoading(false);
      }
    };

    if (!authLoading) {
      fetchCoreData();
    }
  }, [authLoading, user?.id]);

  const handleProposalClick = async (proposalId) => {
    try {
      const response = await api.get(`/sinais-propostos/${proposalId}`);
      setSelectedProposal(response.data);
      setIsProposalModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes da proposta:", error);
    }
  };
  
  const handleCloseModal = () => {
    setIsProposalModalOpen(false);
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

  if (authLoading || pageLoading) {
    return (
      <MainLayout variant="user">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mb-4"></div>
            <p className="text-center text-brand-text-secondary">A carregar perfil...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const ContributorStatsContent = () => (
    <div className="space-y-6">
      {/* Card de Ranking */}
      <div className="bg-gradient-to-r from-blue-400 to-brand-blue rounded-xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Posição no Ranking</h3>
            <span className="text-4xl font-bold">#{userStats.ranking || 'N/A'}</span>
            <p className="text-blue-100 mt-2 text-sm">Continue a contribuir para subir no ranking!</p>
          </div>
          <Trophy size={48} className="text-yellow-300" />
        </div>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard type="submitted" value={userStats.submitted} label="Sinais Submetidos" />
        <StatCard type="approved" value={userStats.approved} label="Sinais Aprovados" />
        <StatCard type="rejected" value={userStats.rejected} label="Sinais Recusados" />
        <StatCard type="pending" value={userStats.pending} label="Sinais Pendentes" />
      </div>

      {/* Propostas Recentes com design aprimorado */}
      <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-blue-50">
          <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
            <Send size={20} className="text-brand-blue" />
          </div>
          <h3 className="text-xl font-bold text-brand-text-primary">
            Minhas Propostas Recentes
          </h3>
        </div>
        <ProposalList proposals={submittedProposals} onProposalClick={handleProposalClick} />
      </div>
    </div>
  );
  
  const VinculoFlowContent = () => {
    switch (vinculoView) {
      case 'vincular':
        return (
          <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-blue-50">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-brand-text-primary">
                Vincular à Instituição
              </h3>
            </div>
            <SolicitarVinculoForm />
            <div className="text-center mt-6 pt-6 border-t-2 border-blue-50">
              <p className="text-sm text-brand-text-secondary">
                A sua instituição não está na lista?{' '}
                <button 
                  onClick={() => setVinculoView('cadastrar')} 
                  className="font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors underline decoration-2 decoration-brand-blue/30 hover:decoration-brand-blue"
                >
                  Cadastre uma nova
                </button>
              </p>
            </div>
          </div>
        );
      case 'cadastrar':
        return (
          <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-blue-50">
              <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                <ShieldCheck size={20} className="text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold text-brand-text-primary">
                Cadastrar Nova Instituição
              </h3>
            </div>
            <SolicitarInstituicaoForm />
            <div className="text-center mt-6 pt-6 border-t-2 border-blue-50">
              <button 
                onClick={() => setVinculoView('vincular')} 
                className="text-sm font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors inline-flex items-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span>Voltar para a lista de instituições</span>
              </button>
            </div>
          </div>
        );
      case 'cta':
      default:
        return (
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl border-2 border-blue-200 shadow-sm p-10 text-center">
            {/* Decoração de fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-blue/5 rounded-full -ml-20 -mb-20"></div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-blue to-blue-600 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg rotate-3 hover:rotate-6 transition-transform">
                <ShieldCheck size={48} className="text-white -rotate-3" />
              </div>
              <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                Vínculo Institucional Necessário
              </h3>
              <p className="text-brand-text-secondary text-base mb-8 max-w-md mx-auto leading-relaxed">
                Para poder submeter novos sinais e contribuir com o nosso glossário, é necessário que o seu perfil esteja verificado e vinculado a uma instituição de ensino ou pesquisa.
              </p>
              <button
                onClick={() => setVinculoView('vincular')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-brand-blue-dark transition-all transform hover:scale-105"
              >
                <ShieldCheck size={20} />
                <span>Iniciar Vinculação</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {isProposalModalOpen && <ProposalDetailModal proposal={selectedProposal} onClose={handleCloseModal} />}
      {isPasswordModalOpen && <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />}

      <MainLayout variant="user">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* Sidebar - Card do Usuário */}
            <div className="lg:col-span-1 lg:sticky lg:top-28">
              <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-2xl shadow-sm overflow-hidden">
                <UserProfileCard user={user} onEditProfile={handleToggleEdit} editButtonClassName="bg-brand-blue hover:bg-brand-blue-dark text-white" />
              </div>
              {formMessage.text && (
                <div className={`mt-4 p-4 rounded-xl text-sm font-semibold border-2 ${
                  formMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700 border-green-300' 
                    : 'bg-red-50 text-red-700 border-red-300'
                }`}>
                  {formMessage.text}
                </div>
              )}
            </div>

            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              {isEditing ? (
                <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-blue-50">
                    <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                      <Edit size={20} className="text-brand-blue" />
                    </div>
                    <h2 className="text-2xl font-bold text-brand-text-primary">Editar Perfil</h2>
                  </div>
                  
                  <form onSubmit={handleSaveChanges}>
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-8 pb-6 border-b-2 border-blue-50">
                      <label htmlFor="avatar-edit-upload" className="cursor-pointer group">
                        <div className="relative">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Preview" className="w-32 h-32 rounded-2xl object-cover ring-4 ring-brand-blue/20 group-hover:ring-brand-blue/40 transition-all" />
                          ) : user.avatarUrl ? (
                            <img src={`http://localhost:3000/${user.avatarUrl}`} alt={user.nome} className="w-32 h-32 rounded-2xl object-cover ring-4 ring-brand-blue/20 group-hover:ring-brand-blue/40 transition-all" />
                          ) : (
                            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-blue-500/20 flex items-center justify-center ring-4 ring-brand-blue/20 group-hover:ring-brand-blue/40 transition-all">
                              <UserCircle size={64} className="text-brand-blue" />
                            </div>
                          )}
                          <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                            <div className="bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                              <Edit size={24} className="text-brand-blue" />
                            </div>
                          </div>
                        </div>
                      </label>
                      <input 
                        id="avatar-edit-upload" 
                        name="avatar" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                      />
                      <label 
                        htmlFor="avatar-edit-upload" 
                        className="mt-4 px-4 py-2 text-sm font-semibold text-brand-blue hover:text-white bg-blue-50 hover:bg-brand-blue rounded-lg cursor-pointer transition-all"
                      >
                        Alterar foto de perfil
                      </label>
                    </div>

                    {/* Campos do Formulário */}
                    <div className="space-y-5 mb-8">
                      <div>
                        <label htmlFor="nome" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-brand-blue/10 flex items-center justify-center">
                            <UserCircle size={14} className="text-brand-blue" />
                          </div>
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          name="nome"
                          id="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-600">@</span>
                          </div>
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-brand-text-secondary mt-2">O email não pode ser alterado.</p>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button 
                        type="submit" 
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-blue-dark transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Save size={18} />
                        <span>Guardar Alterações</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={handleToggleEdit} 
                        className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-brand-text-primary font-semibold rounded-lg hover:bg-gray-200 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  {/* Estatísticas do Contribuidor ou Fluxo de Vínculo */}
                  {user?.idInstituicao ? <ContributorStatsContent /> : <VinculoFlowContent />}

                  {/* Atividades do Usuário - Visível para todos */}
                  <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-sm p-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-brand-text-primary inline-flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                          <UserCircle size={18} className="text-brand-blue" />
                        </div>
                        Atividades Recentes
                      </h3>
                    </div>
                    
                    <div className="space-y-8">
                      {/* Sinais Guardados */}
                      <div className="bg-blue-50/50 rounded-xl p-5 border-2 border-blue-100">
                        <h4 className="text-lg font-bold text-brand-text-primary mb-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-brand-blue flex items-center justify-center">
                            <Bookmark size={18} className="text-white" />
                          </div>
                          <span>Sinais Salvos</span>
                        </h4>
                        <SavedList saved={savedSigns} />
                      </div>

                      {/* Sinais Curtidos */}
                      <div className="bg-red-50/50 rounded-xl p-5 border-2 border-red-100">
                        <h4 className="text-lg font-bold text-brand-text-primary mb-4 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center">
                            <Heart size={18} className="text-white fill-current" />
                          </div>
                          <span>Sinais Curtidos</span>
                        </h4>
                        <LikedList liked={likedSigns} />
                      </div>

                      {/* Segurança da Conta */}
                      <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                        <div className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                            <Key size={18} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-brand-text-primary mb-2">Segurança da Conta</h4>
                            <p className="text-brand-text-secondary text-sm mb-4 leading-relaxed">
                              Altere a sua senha para manter a sua conta segura e protegida.
                            </p>
                            <button 
                              onClick={() => setIsPasswordModalOpen(true)}
                              className="inline-flex items-center gap-2 bg-gray-700 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all text-sm font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
                            >
                              <Key size={16} />
                              <span>Alterar senha</span>
                            </button>
                          </div>
                        </div>
                      </div>
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