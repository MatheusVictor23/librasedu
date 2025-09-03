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

const create = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.senha, 10);
  return prisma.usuario.create({
    data: {
      ...userData,
      senha: hashedPassword,
    },
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

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getAllEvaluators,
  createEvaluator,
  getDashboardStats, 
  getRecentUsers,
  getUsersByRole
};