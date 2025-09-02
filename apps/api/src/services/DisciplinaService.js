import prisma from '../prismaClient.js';

const getAll = async () => {
  return prisma.disciplina.findMany({
    include: {
      curso: true,
    },

  });
};

const create = async (data) => {
  const { nome, cargaHoraria, idCurso } = data;

  return prisma.disciplina.create({
    data: {
      nome,
      cargaHoraria,
      curso: {
        connect: {
          id: parseInt(idCurso),
        },
      },
    },
    include: {
      curso: true,
    },
  });
};

export default {
  getAll,
  create,
};