import prisma from '../prismaClient.js';

const getAll = async () => {
  return prisma.sinalProposto.findMany({
    include: {
      disciplina: {
        include: {
          curso: {
            select: {
              id: true,
              nome: true,
              areasConhecimento: {
                select: {
                  id: true,
                  nome: true,
                }
              }
            }
          }, 
        }
      },
      proposer: {
        select: {
          id: true,
          nome: true,
          email: true,
          instituicao: {
            select: {
              id: true,
              nome: true,  
            }
          }
        }
      },
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
      },
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

  const formattedData = proposals.map(item => ({
    date: new Date(item.createdAt).toISOString().split('T')[0], 
    count: item._count.id,
  }));

  return formattedData;
};

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

const submitEvaluation = async (proposalId, evaluatorId, status, comentarios) => {
  const updatedProposal = await prisma.sinalProposto.update({
    where: { id: parseInt(proposalId) },
    data: {
      status,
      avaliadorId: parseInt(evaluatorId),
      comentariosAvaliador: comentarios,
    },
  });

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
    where: { status }, 
    include: {
      proposer: { select: { nome: true } },
      avaliador: { select: { nome: true } },
      disciplina: { select: { nome: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
};


const updateSinalProposto = async (id, data) => {
  try {
    // Atualiza os campos do sinal proposto
    const sinal = await prisma.sinalProposto.update({
      where: { id: Number(id) },
      data: {
        avaliadorId: data.avaliadorId,
        comentariosAvaliador: data.comentariosAvaliador,
        updatedAt: new Date(),
        // se quiser salvar status, pode incluir aqui
        status: data.status || 'PENDENTE'
      }
    });

    return { sucesso: true, dados: sinal };
  } catch (error) {
    console.error("Erro no service updateSinalProposto:", error);
    return { sucesso: false, mensagem: "Erro ao atualizar sinal proposto" };
  }
};


export default {
  getAll,
  create,
  getProposalsByDay,
  getPendingProposals,
  submitEvaluation,
  getProposalsByStatus,
  updateSinalProposto,
};