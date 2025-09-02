// apps/web/src/pages/ApprovedProposalsPage.jsx
import React, { useState, useEffect } from 'react';
import EvaluatorLayout from '../layouts/EvaluatorLayout';
import api from '../api/axiosConfig';

const ApprovedProposalsPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/evaluator/proposals/aprovado')
      .then(response => setProposals(response.data))
      .catch(error => console.error("Erro ao buscar sinais aprovados:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <EvaluatorLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sinais Aprovados</h2>
      {/* Aqui pode implementar uma tabela ou lista para exibir os 'proposals' */}
      <p>Total de sinais aprovados: {proposals.length}</p>
    </EvaluatorLayout>
  );
};
export default ApprovedProposalsPage;