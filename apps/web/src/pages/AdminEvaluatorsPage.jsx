// apps/web/src/pages/AdminEvaluatorsPage.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../api/axiosConfig';
import { Trash2, Edit, PlusCircle } from 'lucide-react';
import EvaluatorFormModal from '../components/admin/EvaluatorFormModal.jsx';
import InstitutionFormModal from '../components/admin/InstitutionFormModal'; // Importar o modal de instituições

const AdminEvaluatorsPage = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [institutions, setInstitutions] = useState([]); // NOVO: Estado para armazenar as instituições
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEvaluatorModalOpen, setIsEvaluatorModalOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);

  // NOVO: Estados para controlar o modal de instituição
  const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false);

  const fetchData = async () => {
    // Agora carrega tanto avaliadores quanto instituições
    setLoading(true);
    try {
      const [evaluatorsRes, institutionsRes] = await Promise.all([
        api.get('/admin/evaluators'),
        api.get('/instituicoes')
      ]);
      setEvaluators(evaluatorsRes.data);
      setInstitutions(institutionsRes.data);
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

  const handleDelete = async (evaluatorId) => {
    if (window.confirm('Tem a certeza de que quer apagar este avaliador?')) {
      try {
        // A rota correta para apagar utilizadores é /admin/users/:id
        await api.delete(`/admin/users/${evaluatorId}`);
        fetchData(); // Recarrega os dados para atualizar a lista
      } catch (err) {
        alert('Erro ao apagar o avaliador.');
      }
    }
  };

  // Funções para o modal de AVALIADOR
  const handleOpenEvaluatorModal = (evaluator = null) => {
    setSelectedEvaluator(evaluator);
    setIsEvaluatorModalOpen(true);
  };

  const handleCloseEvaluatorModal = () => {
    setIsEvaluatorModalOpen(false);
    setSelectedEvaluator(null);
  };

  const handleSaveEvaluator = () => {
    handleCloseEvaluatorModal();
    fetchData();
  };

  // NOVO: Funções para o modal de INSTITUIÇÃO
  const handleOpenInstitutionModal = () => {
    setIsInstitutionModalOpen(true);
  };

  const handleCloseInstitutionModal = () => {
    setIsInstitutionModalOpen(false);
  };

  const handleSaveInstitution = () => {
    handleCloseInstitutionModal();
    fetchData(); // Recarrega os dados, atualizando a lista de instituições no outro modal
  };

  if (error) return <AdminLayout><p className="text-red-500">{error}</p></AdminLayout>;

  return (
    <AdminLayout>
      {/* Modal de Avaliador */}
      {isEvaluatorModalOpen && (
        <EvaluatorFormModal 
          evaluator={selectedEvaluator} 
          institutions={institutions} // Passa a lista de instituições
          onClose={handleCloseEvaluatorModal}
          onSave={handleSaveEvaluator}
          onAddNewInstitution={handleOpenInstitutionModal} // Passa a função para abrir o outro modal
        />
      )}

      {/* NOVO: Modal de Instituição */}
      {isInstitutionModalOpen && (
        <InstitutionFormModal
          onClose={handleCloseInstitutionModal}
          onSave={handleSaveInstitution}
        />
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-brand-text-primary">Gestão de Avaliadores</h3>
          <button
            onClick={() => handleOpenEvaluatorModal()}
            className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-md hover:bg-brand-blue-dark transition-colors text-sm font-medium"
          >
            <PlusCircle size={18} />
            Adicionar Avaliador
          </button>
        </div>
        
        {loading ? (
          <p className="p-6">A carregar avaliadores...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Instituição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-brand-text-secondary uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {evaluators.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.instituicao?.sigla || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleOpenEvaluatorModal(user)}
                        className="text-brand-blue hover:text-brand-blue-dark mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)} 
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEvaluatorsPage;