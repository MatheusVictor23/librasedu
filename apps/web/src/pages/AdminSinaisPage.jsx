// apps/web/src/pages/AdminSinaisPage.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import api from '../api/axiosConfig';
import { Video, Clock, CheckCircle } from 'lucide-react';

const AdminSinaisPage = () => {
  const [proposals, setProposals] = useState([]);
  const [officialSignals, setOfficialSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Faz as duas chamadas à API em paralelo
        const [proposalsResponse, officialSignalsResponse] = await Promise.all([
          api.get('/admin/sinais-propostos'),
          api.get('/admin/sinais-oficiais')
        ]);
        setProposals(proposalsResponse.data);
        setOfficialSignals(officialSignalsResponse.data);
      } catch (err) {
        setError('Não foi possível carregar os dados dos sinais.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  if (error) return <AdminLayout><p className="text-red-500">{error}</p></AdminLayout>;

  return (
    <AdminLayout>
      {loading ? (
        <p>A carregar sinais...</p>
      ) : (
        <div className="space-y-8">
          {/* Tabela de Sinais Propostos */}
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
                        <a href={p.videoUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
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
                        <a href={s.videoUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">
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