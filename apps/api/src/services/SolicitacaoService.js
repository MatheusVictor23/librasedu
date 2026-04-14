import prisma from '../prismaClient.js';

const createSolicitacaoVinculo = async (data) => {
  const { usuarioId, instituicaoId, documentoComprovativoUrl } = data;
  return prisma.solicitacaoVinculo.create({
    data: {
      usuarioId: parseInt(usuarioId),
      instituicaoId: parseInt(instituicaoId),
      documentoComprovativoUrl,
    },
  });
};

const createSolicitacaoInstituicao = async (data) => {
  const {
    usuarioId,
    nomeInstituicao,
    cidade,
    estado,
    nomeRepresentante,
    cargoRepresentante,
    documentoComprovativoUsuarioUrl,
    documentoComprovativoRepresentanteUrl,
  } = data;

  return prisma.solicitacaoInstituicao.create({
    data: {
      usuarioId: parseInt(usuarioId),
      nomeInstituicao,
      cidade,
      estado,
      nomeRepresentante,
      cargoRepresentante,
      documentoComprovativoUsuarioUrl,
      documentoComprovativoRepresentanteUrl,
    },
  });
};

const getAllPending = async () => {
  const vinculos = await prisma.solicitacaoVinculo.findMany({
    where: { status: 'PENDENTE' },
    include: { usuario: true, instituicao: true },
  });
  const instituicoes = await prisma.solicitacaoInstituicao.findMany({
    where: { status: 'PENDENTE' },
    include: { usuario: true },
  });
  return { vinculos, instituicoes };
};

const approveSolicitacaoVinculo = async (solicitacaoId) => {
  const solicitacao = await prisma.solicitacaoVinculo.findUnique({ where: { id: parseInt(solicitacaoId) } });
  if (!solicitacao) throw new Error("Solicitação não encontrada");

  return prisma.$transaction([
    prisma.usuario.update({
      where: { id: solicitacao.usuarioId },
      data: { idInstituicao: solicitacao.instituicaoId },
    }),
    prisma.solicitacaoVinculo.update({
      where: { id: parseInt(solicitacaoId) },
      data: { status: 'APROVADO' },
    }),
  ]);
};

const rejectSolicitacaoVinculo = async (solicitacaoId, adminFeedback) => {
  return prisma.solicitacaoVinculo.update({
    where: { id: parseInt(solicitacaoId) },
    data: { status: 'REJEITADO', adminFeedback },
  });
};

const approveSolicitacaoInstituicao = async (solicitacaoId) => {
  const solicitacao = await prisma.solicitacaoInstituicao.findUnique({ where: { id: parseInt(solicitacaoId) } });
  if (!solicitacao) throw new Error("Solicitação não encontrada");

  return prisma.$transaction(async (tx) => {
    // CORREÇÃO AQUI: Passa todos os campos da solicitação para a criação da nova instituição
    const novaInstituicao = await tx.instituicao.create({
      data: {
        nome: solicitacao.nomeInstituicao,
        // Gera uma sigla simples a partir do nome
        sigla: solicitacao.nomeInstituicao.match(/\b(\w)/g)?.join('').toUpperCase() || solicitacao.nomeInstituicao.substring(0, 3).toUpperCase(),
        cidade: solicitacao.cidade,
        estado: solicitacao.estado,
        nomeRepresentante: solicitacao.nomeRepresentante,
        cargoRepresentante: solicitacao.cargoRepresentante,
      },
    });

    await tx.usuario.update({
      where: { id: solicitacao.usuarioId },
      data: { idInstituicao: novaInstituicao.id },
    });

    return tx.solicitacaoInstituicao.update({
      where: { id: parseInt(solicitacaoId) },
      data: { status: 'APROVADO' },
    });
  });
};

const rejectSolicitacaoInstituicao = async (solicitacaoId, adminFeedback) => {
  return prisma.solicitacaoInstituicao.update({
    where: { id: parseInt(solicitacaoId) },
    data: { status: 'REJEITADO', adminFeedback },
  });
};

export default {
  createSolicitacaoVinculo,
  createSolicitacaoInstituicao,
  getAllPending,
  approveSolicitacaoVinculo,
  rejectSolicitacaoVinculo,
  approveSolicitacaoInstituicao,
  rejectSolicitacaoInstituicao,
};