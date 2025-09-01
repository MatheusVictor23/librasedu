// src/services/UserService.js
import { PrismaClient } from '../../generated/prisma/index.js';
import bcrypt from 'bcryptjs';

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
  // Faz o hash da senha antes de a guardar
  const hashedPassword = await bcrypt.hash(userData.senha, 10);

  return prisma.usuario.create({
    data: {
      ...userData,
      senha: hashedPassword,
    },
  });
};

const update = async (id, userData) => {
  // Adicionar lógica de hash aqui também se a senha puder ser atualizada
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

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};