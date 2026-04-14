// apps/web/src/pages/ApprovedProposalsPage.jsx
import React, { useState, useEffect } from 'react';
import EvaluatorLayout from '../layouts/EvaluatorLayout';
import api from '../api/axiosConfig';
import ProposalHistoryCard from '../components/ProposalHistoryCard'; // Importar o novo componente

const ApprovedProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/evaluator/proposals/aprovado')
      .then(response => setProposals(response.data))
      .catch(error => {
        console.error("Erro ao buscar sinais aprovados:", error);
        setError('Não foi possível carregar o histórico de sinais aprovados.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <EvaluatorLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Sinais Aprovados</h2>
        <span className="text-lg font-semibold text-gray-600 bg-gray-100 px-4 py-1 rounded-lg">{proposals.length}</span>
      </div>

      {loading && <p>A carregar histórico...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-4">
          {proposals.length > 0 ? (
            proposals.map(proposal => (
              <ProposalHistoryCard key={proposal.id} proposal={proposal} />
            ))
          ) : (
             <div className="text-center text-gray-500 py-16 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">Nenhum sinal aprovado</h3>
                <p>O seu histórico de avaliações aprovadas aparecerá aqui.</p>
            </div>
          )}
        </div>
      )}
    </EvaluatorLayout>
  );
};

export default ApprovedProposalsPage;