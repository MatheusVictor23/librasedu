// apps/web/src/pages/AdminDisciplinasPage.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../api/axiosConfig';
import { Check, X, GitMerge, Clock, CheckCircle } from 'lucide-react';
import MergeDisciplinaModal from '../components/admin/MergeDisciplinaModal';

const AdminDisciplinasPage = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDisciplina, setSelectedDisciplina] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/disciplinas');
      setDisciplinas(response.data);
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

  const handleManageDisciplina = async (id, action, targetId = null) => {
    try {
      const payload = { action, targetId };
      await api.post(`/admin/disciplinas/${id}/manage`, payload);
      fetchData(); // Recarrega os dados após a ação
      if (isModalOpen) setIsModalOpen(false); // Fecha o modal se a ação veio de lá
    } catch (err) {
      alert(`Erro ao executar a ação "${action}": ${err.response?.data?.details || err.message}`);
    }
  };

  const openMergeModal = (disciplina) => {
    setSelectedDisciplina(disciplina);
    setIsModalOpen(true);
  };

  const pendingDisciplinas = disciplinas.filter(d => d.status === 'PENDENTE');
  const approvedDisciplinas = disciplinas.filter(d => d.status === 'APROVADO');

  return (
    <AdminLayout>
      {isModalOpen && (
        <MergeDisciplinaModal
          disciplina={selectedDisciplina}
          approvedDisciplinas={approvedDisciplinas}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleManageDisciplina}
        />
      )}

      <h2 className="text-2xl font-semibold text-brand-text-primary mb-6">Gestão de Disciplinas</h2>
      
      {loading && <p>A carregar...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && (
        <div className="space-y-8">
          {/* Tabela de Disciplinas Pendentes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex items-center gap-3">
                <Clock size={20} className="text-yellow-600" />
                <h3 className="text-lg font-semibold">Disciplinas Pendentes de Aprovação</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Nome Sugerido</th>
                        <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingDisciplinas.map(d => (
                    <tr key={d.id}>
                      <td className="p-4 whitespace-nowrap font-medium">{d.nome}</td>
                      <td className="p-4 whitespace-nowrap space-x-2">
                        <button onClick={() => handleManageDisciplina(d.id, 'approve')} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200" title="Aprovar">
                          <Check size={16} />
                        </button>
                        <button onClick={() => openMergeModal(d)} className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200" title="Mesclar">
                          <GitMerge size={16} />
                        </button>
                        <button onClick={() => handleManageDisciplina(d.id, 'reject')} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200" title="Rejeitar">
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pendingDisciplinas.length === 0 && <p className="p-4 text-center text-gray-500">Nenhuma disciplina pendente.</p>}
            </div>
          </div>

          {/* Tabela de Disciplinas Aprovadas */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <h3 className="text-lg font-semibold">Catálogo de Disciplinas Aprovadas</h3>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">Curso Associado</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {approvedDisciplinas.map(d => (
                            <tr key={d.id}>
                                <td className="p-4 whitespace-nowrap font-medium">{d.nome}</td>
                                <td className="p-4 whitespace-nowrap text-sm text-gray-600">{d.curso?.nome || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {approvedDisciplinas.length === 0 && <p className="p-4 text-center text-gray-500">Nenhuma disciplina aprovada.</p>}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDisciplinasPage;