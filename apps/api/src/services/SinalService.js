import prisma from '../prismaClient.js';

const getAll = async () => {
  return prisma.sinal.findMany({
    include: {
      disciplina: true,
      sinalProposto: {
        include: {
          proposer: true,
          avaliador: true,
        },
      },
      _count: {
        select: { SinalFavorito: true },
      },
    },
  });
};

const getTrending = async (take = 6) => {
  return prisma.sinal.findMany({
    take,
    include: {
      _count: {
        select: { SinalFavorito: true },
      },
    },
    orderBy: {
      SinalFavorito: {
        _count: 'desc',
      },
    },
  });
};

const getRecent = async (take = 6) => {
  return prisma.sinal.findMany({
    take,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
        _count: {
            select: { SinalFavorito: true },
        },
    }
  });
};

const getRecommended = async (take = 6) => {
    const totalSinais = await prisma.sinal.count();
    const skip = Math.max(0, Math.floor(Math.random() * totalSinais) - take);
    return prisma.sinal.findMany({
        take,
        skip,
        include: {
            _count: {
                select: { SinalFavorito: true },
            },
        }
    });
};

const search = async (term) => {
    return prisma.sinal.findMany({
        where: {
            nome: {
                contains: term,
                mode: 'insensitive'
            }
        },
        include: {
            _count: {
                select: { SinalFavorito: true },
            },
        }
    })
}

const createFromProposal = async (data) => {
  const { sinalPropostoId } = data;
  const proposta = await prisma.sinalProposto.findUnique({
    where: { id: parseInt(sinalPropostoId) },
  });

  if (!proposta) {
    throw new Error('Proposta de sinal não encontrada.');
  }

  return prisma.sinal.create({
    data: {
      nome: proposta.nome,
      descricao: proposta.descricao,
      videoUrl: proposta.videoUrl,
      disciplina: { connect: { id: proposta.disciplinaId } },
      sinalProposto: { connect: { id: proposta.id } },
    },
  });
};

export default {
  getAll,
  createFromProposal,
  getTrending,
  getRecent,
  getRecommended,
  search
};