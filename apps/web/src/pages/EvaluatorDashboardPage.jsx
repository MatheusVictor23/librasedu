// apps/web/src/pages/EvaluatorDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import EvaluatorLayout from '../layouts/EvaluatorLayout';
import api from '../api/axiosConfig';
// Ícones adicionados para a nova interface
import { ArrowRight, FileText, User, Clock } from 'lucide-react';
import EvaluationModal from '../components/EvaluationModal';

// NOVO COMPONENTE: ProposalCard redesenhado
const ProposalCard = ({ proposal, onEvaluate }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 border border-gray-100 group">
        <div className="p-5">
            <div className="flex items-start justify-between mb-3">
                <div className="bg-blue-50 text-brand-blue p-3 rounded-lg">
                    <FileText size={24} />
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {proposal.disciplina.nome}
                </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 truncate mb-1">{proposal.nome}</h3>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
                <User size={14} className="mr-2" />
                <span>Enviado por: {proposal.proposer.nome}</span>
            </div>

            <p className="text-gray-600 text-sm mb-5 line-clamp-2">{proposal.descricao}</p>

            <button 
                onClick={() => onEvaluate(proposal)} 
                className="w-full text-brand-blue bg-blue-50 hover:bg-blue-100 text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
            >
                Avaliar Proposta
                <ArrowRight size={16} className="transform transition-transform duration-300 group-hover:translate-x-1" />
            </button>
        </div>
        <div className="bg-gray-50 px-5 py-2 text-xs text-gray-500 flex items-center">
            <Clock size={12} className="mr-1.5" />
            Recebido em: {new Date(proposal.createdAt).toLocaleDateString('pt-BR')}
        </div>
  </div>
);


const EvaluatorDashboardPage = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleEvaluateClick = (proposal) => {
    setSelectedProposal(proposal);
  };

  const handleCloseModal = () => {
    setSelectedProposal(null);
  };

  const handleSaveEvaluation = () => {
    setSelectedProposal(null);
    fetchPendingProposals();
  };
  
  return (
    <EvaluatorLayout>
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
            <div className="col-span-full text-center text-gray-500 py-16 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">Tudo certo por aqui!</h3>
                <p>Não há propostas pendentes para avaliação no momento.</p>
            </div>
          )}
        </div>
      )}
    </EvaluatorLayout>
  );
};

export default EvaluatorDashboardPage;