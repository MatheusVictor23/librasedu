import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

const getAll = async () => {
  return prisma.curso.findMany({
    include: {
      areasConhecimento: true,
    },
  });
};

const create = async (data) => {
  const { nome, areasConhecimentoIds } = data;

  return prisma.curso.create({
    data: {
      nome,
      areasConhecimento: {
        connect: areasConhecimentoIds.map(id => ({ id: parseInt(id) })),
      },
    },
    include: {
      areasConhecimento: true,
    },
  });
};

export default {
  getAll,
  create,
};