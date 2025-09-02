// apps/web/src/pages/AdminEvaluatorsPage.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../api/axiosConfig';
import { Trash2, Edit, PlusCircle } from 'lucide-react';
import EvaluatorFormModal from '../components/admin/EvaluatorFormModal.jsx'; // 1. Importar o modal

const AdminEvaluatorsPage = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 2. Estados para controlar o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);

  const fetchEvaluators = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/evaluators');
      setEvaluators(response.data);
    } catch (err) {
      setError('Não foi possível carregar os avaliadores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluators();
  }, []);

  const handleDelete = async (evaluatorId) => {
    if (window.confirm('Tem a certeza de que quer apagar este avaliador?')) {
      try {
        await api.delete(`/admin/evaluators/${evaluatorId}`);
        setEvaluators(evaluators.filter(e => e.id !== evaluatorId));
      } catch (err) {
        alert('Erro ao apagar o avaliador.');
      }
    }
  };

  // 3. Funções para abrir/fechar e salvar o modal
  const handleOpenModal = (evaluator = null) => {
    setSelectedEvaluator(evaluator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvaluator(null);
  };

  const handleSave = () => {
    handleCloseModal();
    fetchEvaluators(); // Re-carrega os dados após salvar
  };

  if (error) return <AdminLayout><p className="text-red-500">{error}</p></AdminLayout>;

  return (
    <AdminLayout>
      {/* 4. Renderizar o modal condicionalmente */}
      {isModalOpen && (
        <EvaluatorFormModal 
          evaluator={selectedEvaluator} 
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-brand-text-primary">Gestão de Avaliadores</h3>
          <button
            onClick={() => handleOpenModal()} // Botão para adicionar
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
                        onClick={() => handleOpenModal(user)} // Botão para editar
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