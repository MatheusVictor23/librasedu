import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

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
  return prisma.usuario.create({
    data: userData,
  });
};

const update = async (id, userData) => {
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

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};