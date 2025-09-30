import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../api/axiosConfig';
import { Check, X, Download, Link2, Building, PlusCircle, Edit, Trash2 } from 'lucide-react';
import InstitutionFormModal from '../components/admin/InstitutionFormModal';

const AdminInstitutionsPage = () => {
  const [solicitacoes, setSolicitacoes] = useState({ vinculos: [], instituicoes: [] });
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [solicitacoesRes, instituicoesRes] = await Promise.all([
        api.get('/admin/solicitacoes/pendentes'),
        api.get('/instituicoes')
      ]);
      setSolicitacoes(solicitacoesRes.data);
      setAllInstitutions(instituicoesRes.data);
    } catch (err) {
      setError('Não foi possível carregar os dados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleManageRequest = async (type, id, action) => {
    const adminFeedback = feedback[id] || '';
    if (action === 'reject' && !adminFeedback.trim()) {
      alert('O feedback é obrigatório para rejeitar uma solicitação.');
      return;
    }

    try {
      await api.post(`/admin/solicitacoes/${type}/${id}/manage`, { 
        action, 
        feedback: adminFeedback 
      });
      fetchData();
    } catch (err) {
      alert(`Erro ao ${action === 'approve' ? 'aprovar' : 'rejeitar'} a solicitação.`);
      console.error(err);
    }
  };
  
  const handleFeedbackChange = (id, value) => {
    setFeedback(prev => ({ ...prev, [id]: value }));
  };

  const getDocumentUrl = (path) => `http://localhost:3000/${path}`;

  const handleOpenModal = (institution = null) => {
    setSelectedInstitution(institution);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedInstitution(null);
    setIsModalOpen(false);
  };

  const handleSaveInstitution = () => {
    handleCloseModal();
    fetchData();
  };

  const handleDeleteInstitution = async (id) => {
    if (window.confirm('Tem a certeza que quer apagar esta instituição? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete(`/admin/instituicoes/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.error || 'Não foi possível apagar a instituição.');
      }
    }
  };

  return (
    <AdminLayout>
      {isModalOpen && <InstitutionFormModal institution={selectedInstitution} onClose={handleCloseModal} onSave={handleSaveInstitution} />}

      <h2 className="text-2xl font-semibold text-brand-text-primary mb-6">Gestão de Instituições</h2>
      
      {loading && <p>A carregar...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex items-center gap-3">
                <Link2 size={20} className="text-blue-600" />
                <h3 className="text-lg font-semibold">Solicitações de Vínculo Pendentes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Utilizador</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Instituição Solicitada</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solicitacoes.vinculos.map(req => (
                    <tr key={`v-${req.id}`}>
                      <td className="p-4 whitespace-nowrap text-sm">{req.usuario.nome}</td>
                      <td className="p-4 whitespace-nowrap text-sm">{req.instituicao.nome}</td>
                      <td className="p-4">
                        <a href={getDocumentUrl(req.documentoComprovativoUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:underline">
                            <Download size={16} className="mr-1" /> Ver Documento
                        </a>
                      </td>
                      <td className="p-4">
                        <textarea placeholder="Feedback (obrigatório para rejeitar)" onChange={(e) => handleFeedbackChange(req.id, e.target.value)} className="w-full border rounded-md p-2 text-sm"></textarea>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <button onClick={() => handleManageRequest('vinculo', req.id, 'approve')} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 mr-2"><Check size={16} /></button>
                        <button onClick={() => handleManageRequest('vinculo', req.id, 'reject')} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"><X size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {solicitacoes.vinculos.length === 0 && <p className="p-4 text-center text-gray-500">Nenhuma solicitação de vínculo pendente.</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex items-center gap-3">
                <Building size={20} className="text-purple-600" />
                <h3 className="text-lg font-semibold">Solicitações de Nova Instituição</h3>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Nome da Instituição</th>
                            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Solicitante</th>
                            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Documentos</th>
                            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {solicitacoes.instituicoes.map(req => (
                            <tr key={`i-${req.id}`}>
                                <td className="p-4 whitespace-nowrap text-sm font-medium">{req.nomeInstituicao} <br/><span className="font-normal text-gray-500">{req.cidade}, {req.estado}</span></td>
                                <td className="p-4 whitespace-nowrap text-sm">{req.usuario.nome}</td>
                                <td className="p-4 whitespace-nowrap text-sm">
                                    <a href={getDocumentUrl(req.documentoComprovativoUsuarioUrl)} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">Vínculo do Solicitante</a>
                                    <a href={getDocumentUrl(req.documentoComprovativoRepresentanteUrl)} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline mt-1">Vínculo do Representante</a>
                                </td>
                                <td className="p-4">
                                    <textarea placeholder="Feedback (obrigatório para rejeitar)" onChange={(e) => handleFeedbackChange(req.id, e.target.value)} className="w-full border rounded-md p-2 text-sm"></textarea>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <button onClick={() => handleManageRequest('instituicao', req.id, 'approve')} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 mr-2"><Check size={16} /></button>
                                    <button onClick={() => handleManageRequest('instituicao', req.id, 'reject')} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"><X size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {solicitacoes.instituicoes.length === 0 && <p className="p-4 text-center text-gray-500">Nenhuma solicitação de nova instituição pendente.</p>}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-3"><Building size={20} /> Todas as Instituições</h3>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-brand-blue text-white px-3 py-2 rounded-md hover:bg-brand-blue-dark text-sm font-medium">
                  <PlusCircle size={16} /> Adicionar Instituição
                </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Sigla</th>
                    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allInstitutions.map(inst => (
                    <tr key={inst.id}>
                      <td className="p-4 whitespace-nowrap text-sm font-medium">{inst.nome}</td>
                      <td className="p-4 whitespace-nowrap text-sm">{inst.sigla}</td>
                      <td className="p-4 whitespace-nowrap">
                        <button onClick={() => handleOpenModal(inst)} className="p-2 text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteInstitution(inst.id)} className="p-2 text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allInstitutions.length === 0 && <p className="p-4 text-center text-gray-500">Nenhuma instituição registada.</p>}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminInstitutionsPage;