import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

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
    },
  });
};

const createFromProposal = async (data) => {
  const { sinalPropostoId } = data;
  const proposta = await prisma.sinalProposto.findUnique({
    where: { id: parseInt(sinalPropostoId) },
  });

  if (!proposta) {
    throw new Error('Proposta de sinal não encontrada.');
  }

  return prisma.sinal.create({
    data: {
      nome: proposta.nome,
      descricao: proposta.descricao,
      videoUrl: proposta.videoUrl,
      disciplina: { connect: { id: proposta.disciplinaId } },
      sinalProposto: { connect: { id: proposta.id } },
    },
  });
};

export default {
  getAll,
  createFromProposal,
};