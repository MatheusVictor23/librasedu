import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

const getAll = async () => {
  return prisma.sinalProposto.findMany({
    include: {
      disciplina: {
        include: {
          curso: true, 
        }
      },
      proposer: true,
      avaliador: true,
    },
  });
};

const create = async (data) => {
  const { nome, descricao, videoUrl, disciplinaId, proposerId } = data;

  return prisma.sinalProposto.create({
    data: {
      nome,
      descricao,
      videoUrl,
      disciplina: {
        connect: { id: parseInt(disciplinaId) }
      },
      proposer: {
        connect: { id: parseInt(proposerId) }
      }
    },
  });
};

export default {
  getAll,
  create,
};