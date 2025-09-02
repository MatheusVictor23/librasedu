import prisma from '../prismaClient.js';

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