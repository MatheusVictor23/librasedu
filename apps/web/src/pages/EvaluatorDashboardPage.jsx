// apps/web/src/pages/EvaluatorDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import EvaluatorLayout from '../layouts/EvaluatorLayout';
import api from '../api/axiosConfig';
import { ArrowRight } from 'lucide-react';
import EvaluationModal from '../components/EvaluationModal'; 

const ProposalCard = ({ proposal, onEvaluate }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{proposal.nome}</h3>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
          {proposal.disciplina.nome}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{proposal.descricao}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">Enviado por: {proposal.proposer.nome}</span>
        <button onClick={() => onEvaluate(proposal)} className="text-brand-blue hover:text-brand-blue-dark text-sm font-medium flex items-center gap-1">
          Avaliar <ArrowRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

const EvaluatorDashboardPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // 2. Adicionar estado para controlar o modal
  const [selectedProposal, setSelectedProposal] = useState(null);

  const fetchPendingProposals = async () => {
    setLoading(true);
    try {
      const response = await api.get('/evaluator/proposals/pending');
      setProposals(response.data);
    } catch (err) {
      setError('Não foi possível carregar as propostas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProposals();
  }, []);

  // 3. Funções para abrir, fechar e salvar
  const handleEvaluateClick = (proposal) => {
    setSelectedProposal(proposal);
  };

  const handleCloseModal = () => {
    setSelectedProposal(null);
  };

  const handleSaveEvaluation = () => {
    setSelectedProposal(null); // Fecha o modal
    fetchPendingProposals();    // Atualiza a lista de propostas
  };
  
  return (
    <EvaluatorLayout>
      {/* 4. Renderizar o modal condicionalmente */}
      {selectedProposal && (
        <EvaluationModal 
          proposal={selectedProposal} 
          onClose={handleCloseModal}
          onSave={handleSaveEvaluation}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Propostas Pendentes</h2>
      </div>

      {loading && <p>A carregar propostas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proposals.length > 0 ? (
            proposals.map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} onEvaluate={handleEvaluateClick} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">Não há propostas pendentes para avaliação no momento.</p>
          )}
        </div>
      )}
    </EvaluatorLayout>
  );
};

export default EvaluatorDashboardPage;