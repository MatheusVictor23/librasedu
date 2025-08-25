import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

const getAll = async () => {
  return prisma.areaConhecimento.findMany();
};

const create = async (data) => {
  const { nome } = data;
  return prisma.areaConhecimento.create({
    data: {
      nome,
    },
  });
};

export default {
  getAll,
  create,
};