// apps/web/src/pages/RejectedProposalsPage.jsx
import React, { useState, useEffect } from 'react';
import EvaluatorLayout from '../layouts/EvaluatorLayout';
import api from '../api/axiosConfig';

const RejectedProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/evaluator/proposals/rejeitado')
      .then(response => setProposals(response.data))
      .catch(error => console.error("Erro ao buscar sinais recusados:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <EvaluatorLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sinais Recusados</h2>
      {/* Aqui pode implementar uma tabela ou lista para exibir os 'proposals' */}
      <p>Total de sinais recusados: {proposals.length}</p>
    </EvaluatorLayout>
  );
};
export default RejectedProposalsPage;