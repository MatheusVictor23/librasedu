// [INÍCIO DO CÓDIGO]
import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../api/axiosConfig';
import { Video, Clock, CheckCircle, UploadCloud } from 'lucide-react';
import PublishSinalModal from '../components/admin/PublishSinalModal'; // 1. Importar o novo modal

const AdminSinaisPage = () => {
  const [proposals, setProposals] = useState([]);
  const [approvedUnpublished, setApprovedUnpublished] = useState([]); // 2. Novo estado para propostas aprovadas
  const [officialSignals, setOfficialSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. Estados para controlar o modal de publicação
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Faz as três chamadas à API em paralelo
      const [proposalsRes, approvedRes, officialSignalsRes] = await Promise.all([
        api.get('/admin/sinais-propostos'), // Pendentes
        api.get('/admin/proposals/approved-unpublished'), // Aprovados aguardando publicação
        api.get('/admin/sinais-oficiais') // Já publicados
      ]);
      setProposals(proposalsRes.data);
      setApprovedUnpublished(approvedRes.data);
      setOfficialSignals(officialSignalsRes.data);
    } catch (err) {
      setError('Não foi possível carregar os dados dos sinais.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenPublishModal = (proposal) => {
    setSelectedProposal(proposal);
    setIsPublishModalOpen(true);
  };

  const handleClosePublishModal = () => {
    setSelectedProposal(null);
    setIsPublishModalOpen(false);
  };

  const handleSignalPublished = () => {
    handleClosePublishModal();
    fetchData(); // Recarrega todos os dados para atualizar as listas
  };
  
  if (error) return <AdminLayout><p className="text-red-500">{error}</p></AdminLayout>;

  return (
    <AdminLayout>
      {isPublishModalOpen && (
        <PublishSinalModal
          proposal={selectedProposal}
          onClose={handleClosePublishModal}
          onPublished={handleSignalPublished}
        />
      )}
      
      {loading ? (
        <p>A carregar sinais...</p>
      ) : (
        <div className="space-y-8">
          {/* Tabela de Propostas Aprovadas Aguardando Publicação */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <UploadCloud size={20} className="text-indigo-600" />
              <h3 className="text-lg font-semibold text-brand-text-primary">Aprovados para Publicação</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Sinal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Proponente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Avaliador</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Ação</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedUnpublished.map(p => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{p.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.proposer.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.avaliador.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenPublishModal(p)}
                          className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm"
                        >
                          Publicar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabela de Sinais Propostos (Pendentes) */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <Clock size={20} className="text-yellow-600" />
              <h3 className="text-lg font-semibold text-brand-text-primary">Propostas Pendentes de Avaliação</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Sinal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Proponente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Vídeo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proposals.map(p => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{p.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.proposer.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={`http://localhost:3000/${p.videoBrutoUrl}`} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                          <Video size={20} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabela de Sinais Oficiais */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <h3 className="text-lg font-semibold text-brand-text-primary">Glossário Oficial de Sinais</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Sinal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Disciplina</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Vídeo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {officialSignals.map(s => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{s.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{s.disciplina.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={s.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
                          <Video size={20} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSinaisPage;
// [FIM DO CÓDIGO]