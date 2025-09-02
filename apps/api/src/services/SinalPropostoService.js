import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();

const getAll = async () => {
  return prisma.sinalProposto.findMany({
    include: {
      disciplina: {
        include: {
          curso: {
            select: {
              id: true,
              nome: true,
              areasConhecimento: {
                select: {
                  id: true,
                  nome: true,
                }
              }
            }
          }, 
        }
      },
      proposer: {
        select: {
          id: true,
          nome: true,
          email: true,
          instituicao: {
            select: {
              id: true,
              nome: true,  
            }
          }
        }
      },
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
      },
    },
  });
};



const updateSinalProposto = async (id, data) => {
  try {
    // Atualiza os campos do sinal proposto
    const sinal = await prisma.sinalProposto.update({
      where: { id: Number(id) },
      data: {
        avaliadorId: data.avaliadorId,
        comentariosAvaliador: data.comentariosAvaliador,
        updatedAt: new Date(),
        // se quiser salvar status, pode incluir aqui
        status: data.status || 'PENDENTE'
      }
    });

    return { sucesso: true, dados: sinal };
  } catch (error) {
    console.error("Erro no service updateSinalProposto:", error);
    return { sucesso: false, mensagem: "Erro ao atualizar sinal proposto" };
  }
};


export default {
  getAll,
  create,
  updateSinalProposto,
};