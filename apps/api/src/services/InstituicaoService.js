import prisma from '../prismaClient.js';

const getAll = async () => {
  return prisma.instituicao.findMany({
    orderBy: { nome: 'asc' }
  });
};

const create = async (data) => {
  // ATUALIZAÇÃO: Incluir todos os novos campos
  const { nome, sigla, cidade, estado, nomeRepresentante, cargoRepresentante } = data;
  return prisma.instituicao.create({
    data: {
      nome,
      sigla,
      cidade,
      estado,
      nomeRepresentante,
      cargoRepresentante,
    },
  });
};

const update = async (id, data) => {
  const { nome, sigla, cidade, estado, nomeRepresentante, cargoRepresentante } = data;
  return prisma.instituicao.update({
    where: { id: parseInt(id) },
    data: { 
      nome, 
      sigla,
      cidade,
      estado,
      nomeRepresentante,
      cargoRepresentante,
    },
  });
};

const remove = async (id) => {
  const usersCount = await prisma.usuario.count({ where: { idInstituicao: parseInt(id) } });
  if (usersCount > 0) {
    throw new Error('Não é possível remover a instituição pois está associada a um ou mais utilizadores.');
  }
  return prisma.instituicao.delete({
    where: { id: parseInt(id) },
  });
};

export default {
  getAll,
  create,
  update,
  remove,
};