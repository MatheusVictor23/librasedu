import prisma from '../prismaClient.js';

const getAll = async () => {
  return prisma.instituicao.findMany();
};

const create = async (data) => {
  const { nome, sigla } = data;
  return prisma.instituicao.create({
    data: {
      nome,
      sigla,
    },
  });
};

export default {
  getAll,
  create,
};