// apps/api/src/services/DisciplinaService.js
import prisma from '../prismaClient.js';

/**
 * Retorna uma lista de todas as disciplinas com status APROVADO.
 * Usado na listagem pública para usuários.
 */
const getAllApproved = async () => {
  return prisma.disciplina.findMany({
    where: {
      status: 'APROVADO',
    },
    include: {
      curso: true,
    },
    orderBy: {
        nome: 'asc'
    }
  });
};

/**
 * Cria uma nova disciplina. Se o nome já existir, retorna a existente.
 * Se for uma nova sugestão, ela é criada com status PENDENTE.
 * Um admin pode criar uma diretamente como APROVADO.
 */
const create = async (data) => {
    const { nome, cargaHoraria, status = 'PENDENTE' } = data; // Status é PENDENTE por padrão
    let { idCurso } = data;

    // Busca por disciplina com o mesmo nome (ignorando maiúsculas/minúsculas)
    const existingDisciplina = await prisma.disciplina.findFirst({
        where: { nome: { equals: nome, mode: 'insensitive' } }
    });

    // Se já existir, retorna a disciplina encontrada para evitar duplicatas
    if (existingDisciplina) {
        return existingDisciplina;
    }

    // Lógica para atribuir um curso genérico se nenhum for fornecido
    if (!idCurso) {
        const defaultCourseName = "Curso Genérico";
        let curso = await prisma.curso.findFirst({ where: { nome: defaultCourseName } });
        if (!curso) {
            const defaultAreaName = "Área Genérica";
            let area = await prisma.areaConhecimento.findFirst({ where: { nome: defaultAreaName } });
            if (!area) {
                area = await prisma.areaConhecimento.create({ data: { nome: defaultAreaName } });
            }
            curso = await prisma.curso.create({
                data: {
                    nome: defaultCourseName,
                    areasConhecimento: { connect: { id: area.id } }
                }
            });
        }
        idCurso = curso.id;
    }

    // Cria a nova disciplina com o status definido
    return prisma.disciplina.create({
        data: {
            nome,
            cargaHoraria,
            status, // Usa o status fornecido ou o padrão 'PENDENTE'
            curso: { connect: { id: parseInt(idCurso) } },
        },
        include: { curso: true },
    });
};


// --- FUNÇÕES PARA ADMINISTRAÇÃO ---

/**
 * Retorna todas as disciplinas, incluindo as pendentes.
 * Usado no painel de administração.
 */
const getAllForAdmin = async () => {
    return prisma.disciplina.findMany({
        include: { curso: true },
        orderBy: { nome: 'asc' }
    });
};

/**
 * Aprova uma disciplina pendente.
 */
const approve = async (disciplinaId) => {
    return prisma.disciplina.update({
        where: { id: parseInt(disciplinaId) },
        data: { status: 'APROVADO' },
    });
};

/**
 * Rejeita e exclui uma disciplina pendente.
 * Adiciona uma verificação para garantir que a disciplina não tenha sinais propostos associados.
 */
const reject = async (disciplinaId) => {
    const id = parseInt(disciplinaId);
    const propostasCount = await prisma.sinalProposto.count({
        where: { disciplinaId: id }
    });

    if (propostasCount > 0) {
        throw new Error('Não é possível rejeitar esta disciplina, pois ela já está associada a propostas de sinais. Considere mesclá-la.');
    }

    return prisma.disciplina.delete({ where: { id } });
};

/**
 * Mescla uma disciplina pendente (source) em uma disciplina aprovada (target).
 * Reatribui todas as propostas de sinais e depois exclui a disciplina pendente.
 */
const merge = async (sourceId, targetId) => {
    const sourceIdInt = parseInt(sourceId);
    const targetIdInt = parseInt(targetId);

    // Usa uma transação para garantir a integridade dos dados
    return prisma.$transaction(async (tx) => {
        // 1. Reatribui todos os Sinais Propostos da disciplina de origem para a de destino
        await tx.sinalProposto.updateMany({
            where: { disciplinaId: sourceIdInt },
            data: { disciplinaId: targetIdInt },
        });

        // 2. Exclui a disciplina de origem (que agora está vazia)
        const deletedDisciplina = await tx.disciplina.delete({
            where: { id: sourceIdInt },
        });

        return deletedDisciplina;
    });
};


export default {
  getAllApproved,
  create,
  getAllForAdmin,
  approve,
  reject,
  merge
};