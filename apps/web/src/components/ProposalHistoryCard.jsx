// apps/web/src/components/ProposalHistoryCard.jsx
import React from 'react';
import { CheckCircle, XCircle, User, Calendar, MessageSquare } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const isApproved = status === 'APROVADO';
    const Icon = isApproved ? CheckCircle : XCircle;
    const colorClasses = isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const text = isApproved ? 'Aprovado' : 'Recusado';

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses}`}>
            <Icon size={14} />
            {text}
        </span>
    );
};

const ProposalHistoryCard = ({ proposal }) => {
    if (!proposal) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{proposal.nome}</h3>
                    <StatusBadge status={proposal.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                        <User size={14} className="mr-2 text-gray-400" />
                        <strong>Proponente:</strong><span className="ml-1.5">{proposal.proposer?.nome || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        <strong>Avaliado em:</strong><span className="ml-1.5">{new Date(proposal.updatedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{proposal.descricao}</p>

                {proposal.comentariosAvaliador && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center text-sm font-semibold text-gray-800 mb-1.5">
                            <MessageSquare size={14} className="mr-2" />
                            Seu Feedback
                        </div>
                        <p className="text-xs text-gray-600 italic">"{proposal.comentariosAvaliador}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProposalHistoryCard;