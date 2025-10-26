// apps/api/src/services/SinalService.js
import prisma from '../prismaClient.js';

// Função auxiliar para enriquecer os sinais com dados do utilizador
const enrichSinaisWithUserData = async (sinais, userId) => {
  if (!userId || sinais.length === 0) return sinais.map(sinal => ({ ...sinal, isLiked: false, isSaved: false }));

  const sinalIds = sinais.map(s => s.id);

  const liked = await prisma.sinalCurtido.findMany({
    where: { sinalId: { in: sinalIds }, usuarioId: userId },
    select: { sinalId: true }
  });

  const saved = await prisma.sinalSalvo.findMany({
    where: { sinalId: { in: sinalIds }, usuarioId: userId },
    select: { sinalId: true }
  });

  const likedIds = new Set(liked.map(l => l.sinalId));
  const savedIds = new Set(saved.map(s => s.sinalId));

  return sinais.map(sinal => ({
    ...sinal,
    isLiked: likedIds.has(sinal.id),
    isSaved: savedIds.has(sinal.id),
  }));
};

const getAll = async (userId) => {
  const sinais = await prisma.sinal.findMany({
    include: {
      disciplina: true,
      sinalProposto: {
        include: {
          proposer: true,
        },
      },
      _count: {
        select: { curtidas: true },
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return enrichSinaisWithUserData(sinais, userId);
};

const getById = async (id, userId) => {
  const sinal = await prisma.sinal.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      disciplina: true,
      sinalProposto: {
        include: {
          proposer: { include: { instituicao: true } },
          avaliador: true,
        },
      },
      _count: {
        select: { curtidas: true },
      },
    },
  });

  if (!sinal) {
    throw new Error('Sinal não encontrado');
  }

  const [enrichedSinal] = await enrichSinaisWithUserData([sinal], userId);
  return enrichedSinal;
};

const getTrending = async (userId, take = 6) => {
  const sinais = await prisma.sinal.findMany({
    take,
    include: {
      disciplina: true,
      sinalProposto: { include: { proposer: true } },
      _count: {
        select: { curtidas: true },
      },
    },
    orderBy: {
      curtidas: {
        _count: 'desc',
      },
    },
  });
  return enrichSinaisWithUserData(sinais, userId);
};

const getRecent = async (userId, take = 6) => {
  const sinais = await prisma.sinal.findMany({
    take,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
        disciplina: true,
        sinalProposto: { include: { proposer: true } },
        _count: {
            select: { curtidas: true },
        },
    }
  });
  return enrichSinaisWithUserData(sinais, userId);
};

const getRecommended = async (userId, take = 6) => {
    const totalSinais = await prisma.sinal.count();
    const skip = Math.max(0, Math.floor(Math.random() * totalSinais) - take);
    const sinais = await prisma.sinal.findMany({
        take,
        skip,
        include: {
            disciplina: true,
            sinalProposto: { include: { proposer: true } },
            _count: {
                select: { curtidas: true },
            },
        }
    });
    return enrichSinaisWithUserData(sinais, userId);
};

const search = async (term, userId) => {
    const sinais = await prisma.sinal.findMany({
        where: {
            nome: {
                contains: term,
                mode: 'insensitive'
            }
        },
        include: {
            disciplina: true,
            sinalProposto: { include: { proposer: true } },
            _count: {
                select: { curtidas: true },
            },
        }
    })
    return enrichSinaisWithUserData(sinais, userId);
}

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

  return prisma.sinal.create({
    data: {
      nome: proposta.nome,
      descricao: proposta.descricao,
      youtubeUrl: youtubeUrl,
      disciplina: { connect: { id: proposta.disciplinaId } },
      sinalProposto: { connect: { id: proposta.id } },
    },
  });
};

const likeSinal = async (sinalId, userId) => {
  return prisma.sinalCurtido.create({
    data: {
      sinalId: parseInt(sinalId, 10),
      usuarioId: parseInt(userId, 10),
    }
  });
};

const unlikeSinal = async (sinalId, userId) => {
  return prisma.sinalCurtido.delete({
    where: {
      usuarioId_sinalId: {
        sinalId: parseInt(sinalId, 10),
        usuarioId: parseInt(userId, 10),
      }
    }
  });
};

const saveSinal = async (sinalId, userId) => {
  return prisma.sinalSalvo.create({
    data: {
      sinalId: parseInt(sinalId, 10),
      usuarioId: parseInt(userId, 10),
    }
  });
};

const unsaveSinal = async (sinalId, userId) => {
  return prisma.sinalSalvo.delete({
    where: {
      usuarioId_sinalId: {
        sinalId: parseInt(sinalId, 10),
        usuarioId: parseInt(userId, 10),
      }
    }
  });
};

const getComentarios = async (sinalId) => {
  return prisma.comentario.findMany({
    where: { sinalId: parseInt(sinalId, 10) },
    include: {
      usuario: {
        select: {
          id: true,
          nome: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const addComentario = async (sinalId, usuarioId, texto) => {
  return prisma.comentario.create({
    data: {
      texto,
      sinalId: parseInt(sinalId, 10),
      usuarioId: parseInt(usuarioId, 10),
    },
    include: {
        usuario: {
            select: {
                id: true,
                nome: true,
                avatarUrl: true
            }
        }
    }
  });
};

const getRecomendacoes = async (disciplinaId, sinalIdAtual) => {
  try {
    const sinais = await prisma.sinal.findMany({
      where: {
        disciplinaId: disciplinaId, // Filtra pela mesma disciplina
        id: {
          not: sinalIdAtual, // Exclui o sinal que o user já está a ver
        },
        isActive: true, // Garante que só recomendamos sinais ativos
      },
      take: 5, // Limita a 5 recomendações (podes ajustar este número)
      include: {
        disciplina: { // Inclui a disciplina para mostrar o nome
          select: { nome: true }
        },
        _count: { // Conta as curtidas para relevância (opcional)
          select: { curtidas: true },
        },
      },
      orderBy: { // Ordena por mais curtidos (opcional, mas bom)
        curtidas: {
          _count: 'desc',
        },
      },
    });
    return sinais;
  } catch (error) {
    throw new Error(`Erro ao buscar recomendações: ${error.message}`);
  }
};

export default {
  getAll,
  getById,
  createFromProposal,
  getTrending,
  getRecent,
  getRecommended,
  search,
  likeSinal,
  unlikeSinal,
  saveSinal,
  unsaveSinal,
  getComentarios,
  addComentario,
  getRecomendacoes
};