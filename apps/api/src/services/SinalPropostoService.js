import prisma from '../prismaClient.js';

const getAll = async () => {
  return prisma.sinalProposto.findMany({
    include: {
      disciplina: {
        include: {
          curso: true, 
        }
      },
      proposer: true,
      avaliador: true,
    },
  });
};

const create = async (data) => {
  const { nome, descricao, videoUrl, disciplinaId, proposerId } = data;

  return prisma.sinalProposto.create({
    data: {
      nome,
      descricao,
      videoUrl,
      disciplina: {
        connect: { id: parseInt(disciplinaId) }
      },
      proposer: {
        connect: { id: parseInt(proposerId) }
      }
    },
  });
};

const getProposalsByDay = async (days = 7) => {
  const today = new Date();
  const dateLimit = new Date();
  dateLimit.setDate(today.getDate() - days);

  const proposals = await prisma.sinalProposto.groupBy({
    by: ['createdAt'],
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: dateLimit,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Formata os dados para o gráfico
  const formattedData = proposals.map(item => ({
    date: new Date(item.createdAt).toISOString().split('T')[0], // Formato AAAA-MM-DD
    count: item._count.id,
  }));

  return formattedData;
};

// NOVA FUNÇÃO para buscar propostas pendentes
const getPendingProposals = async () => {
  return prisma.sinalProposto.findMany({
    where: {
      status: 'PENDENTE',
    },
    include: {
      proposer: { select: { nome: true } },
      disciplina: { select: { nome: true } },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
};

// NOVA FUNÇÃO para um avaliador submeter a sua decisão
const submitEvaluation = async (proposalId, evaluatorId, status, comentarios) => {
  // 1. Atualiza a proposta com o resultado da avaliação
  const updatedProposal = await prisma.sinalProposto.update({
    where: { id: parseInt(proposalId) },
    data: {
      status,
      avaliadorId: parseInt(evaluatorId),
      comentariosAvaliador: comentarios,
    },
  });

  // 2. Se for aprovado, cria o Sinal oficial
  if (status === 'APROVADO') {
    await prisma.sinal.create({
      data: {
        nome: updatedProposal.nome,
        descricao: updatedProposal.descricao,
        videoUrl: updatedProposal.videoUrl,
        disciplinaId: updatedProposal.disciplinaId,
        sinalPropostoId: updatedProposal.id,
      },
    });
  }

  return updatedProposal;
};

const getProposalsByStatus = async (status) => {
  return prisma.sinalProposto.findMany({
    where: { status }, // 'APROVADO' ou 'REJEITADO'
    include: {
      proposer: { select: { nome: true } },
      avaliador: { select: { nome: true } },
      disciplina: { select: { nome: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
};

export default {
  getAll,
  create,
  getProposalsByDay,
  getPendingProposals,
  submitEvaluation,
  getProposalsByStatus,
};