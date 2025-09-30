import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';

const getAll = async () => {
  return prisma.usuario.findMany({
    include: {
      instituicao: true,
    },
  });
};

const getById = async (id) => {
  return prisma.usuario.findUnique({
    where: { id: parseInt(id) },
    include: {
      instituicao: true,
    },
  });
};

const getProfileById = async (id) => {
  return prisma.usuario.findUnique({
    where: { id: parseInt(id) },
    include: {
      instituicao: true,
    },
  });
};

const create = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.senha, 10);
  // Garante que o idInstituicao seja nulo se não for fornecido
  const dataToCreate = {
    ...userData,
    senha: hashedPassword,
    idInstituicao: userData.idInstituicao ? parseInt(userData.idInstituicao, 10) : null,
  };
  return prisma.usuario.create({
    data: dataToCreate,
  });
};

const update = async (id, userData) => {
  if (userData.senha) {
    userData.senha = await bcrypt.hash(userData.senha, 10);
  }
  return prisma.usuario.update({
    where: { id: parseInt(id) },
    data: userData,
  });
};

const updateProfile = async (userId, data) => {
    const allowedUpdates = {};
    if (data.nome && data.nome.trim()) {
        allowedUpdates.nome = data.nome.trim();
    }
    if (data.avatarUrl) {
        allowedUpdates.avatarUrl = data.avatarUrl;
    }

    if (Object.keys(allowedUpdates).length === 0) {
        throw new Error('Nenhum dado válido para atualização foi fornecido.');
    }

    return prisma.usuario.update({
        where: { id: parseInt(userId) },
        data: allowedUpdates,
    });
};

const remove = async (id) => {
  return prisma.usuario.delete({
    where: { id: parseInt(id) },
  });
};

const getAllEvaluators = async () => {
  return prisma.usuario.findMany({
    where: {
      role: 'AVALIADOR',
    },
    include: {
      instituicao: true,
    },
  });
};

const createEvaluator = async (evaluatorData) => {
  const hashedPassword = await bcrypt.hash(evaluatorData.senha, 10);
  
  return prisma.usuario.create({
    data: {
      ...evaluatorData,
      idInstituicao: parseInt(evaluatorData.idInstituicao, 10),
      senha: hashedPassword,
      role: 'AVALIADOR',
    },
  });
};

const getDashboardStats = async () => {
  const [totalUsers, totalEvaluators, totalProposals, totalOfficialSignals] = await prisma.$transaction([
    prisma.usuario.count(),
    prisma.usuario.count({ where: { role: 'AVALIADOR' } }),
    prisma.sinalProposto.count(),
    prisma.sinal.count(),
  ]);

  return {
    totalUsers,
    totalEvaluators,
    totalProposals,
    totalOfficialSignals,
  };
};

const getRecentUsers = async (limit = 5) => {
  return prisma.usuario.findMany({
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      instituicao: true,
    },
  });
};

const getUsersByRole = async () => {
  const roleCounts = await prisma.usuario.groupBy({
    by: ['role'],
    _count: {
      role: true,
    },
  });
  return roleCounts;
};

const getUserStats = async (userId) => {
    const userIdInt = parseInt(userId, 10);

    const submitted = prisma.sinalProposto.count({ where: { proposerId: userIdInt }});
    const approved = prisma.sinalProposto.count({ where: { proposerId: userIdInt, status: 'APROVADO' }});
    const rejected = prisma.sinalProposto.count({ where: { proposerId: userIdInt, status: 'REJEITADO' }});
    const pending = prisma.sinalProposto.count({ where: { proposerId: userIdInt, status: 'PENDENTE' }});

    const [submittedCount, approvedCount, rejectedCount, pendingCount] = await prisma.$transaction([submitted, approved, rejected, pending]);

    const rankingResult = await prisma.$queryRaw`
        SELECT "rank" FROM (
            SELECT "proposerId", RANK() OVER (ORDER BY COUNT(*) DESC) as "rank"
            FROM "SinalProposto"
            WHERE status = 'APROVADO'
            GROUP BY "proposerId"
        ) as "ranked_users"
        WHERE "proposerId" = ${userIdInt}
    `;

    const ranking = rankingResult.length > 0 ? Number(rankingResult[0].rank) : null;

    return {
        submitted: submittedCount,
        approved: approvedCount,
        rejected: rejectedCount,
        pending: pendingCount,
        ranking: ranking
    }
}

const getFavoritedSinais = async (userId) => {
    return prisma.sinalFavorito.findMany({
        where: { usuarioId: parseInt(userId, 10) },
        include: {
            sinal: true
        }
    })
}

const getSubmittedProposals = async (userId) => {
    return prisma.sinalProposto.findMany({
        where: { proposerId: parseInt(userId, 10) },
        orderBy: { createdAt: 'desc' },
        include: {
            disciplina: true
        }
    })
}

export default {
  getAll,
  getById,
  create,
  update,
  updateProfile,
  remove,
  getAllEvaluators,
  createEvaluator,
  getDashboardStats, 
  getRecentUsers,
  getUsersByRole,
  getUserStats,
  getFavoritedSinais,
  getSubmittedProposals,
  getProfileById
};