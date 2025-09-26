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

const getById = async (id) => {
  const sinal = await prisma.sinal.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      disciplina: true,
      sinalProposto: {
        include: {
          proposer: {
            include: {
              instituicao: true,
            },
          },
          avaliador: true,
        },
      },
      _count: {
        select: { SinalFavorito: true },
      },
    },
  });

  if (!sinal) {
    throw new Error('Sinal não encontrado');
  }
  return sinal;
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

// ATUALIZAÇÃO: Esta função agora é chamada pelo Admin para publicar o sinal.
const createFromProposal = async (proposalId, youtubeUrl) => {
  const proposta = await prisma.sinalProposto.findUnique({
    where: { id: parseInt(proposalId) },
  });

  if (!proposta) {
    throw new Error('Proposta de sinal não encontrada.');
  }

  if (proposta.status !== 'APROVADO') {
      throw new Error('Esta proposta ainda não foi aprovada por um avaliador.');
  }

  // Cria o Sinal Oficial com a URL do YouTube fornecida pelo admin
  return prisma.sinal.create({
    data: {
      nome: proposta.nome,
      descricao: proposta.descricao,
      youtubeUrl: youtubeUrl, // Usa a URL final
      disciplina: { connect: { id: proposta.disciplinaId } },
      sinalProposto: { connect: { id: proposta.id } },
    },
  });
};

export default {
  getAll,
  getById,
  createFromProposal,
  getTrending,
  getRecent,
  getRecommended,
  search
};