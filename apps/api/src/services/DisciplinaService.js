import prisma from '../prismaClient.js';

const getAll = async () => {
  return prisma.disciplina.findMany({
    include: {
      curso: true,
    },
  });
};

const create = async (data) => {
  const { nome, cargaHoraria } = data;
  let { idCurso } = data;

  // Se nenhum idCurso for fornecido, usa ou cria um padrão
  if (!idCurso) {
    const defaultCourseName = "Curso Genérico";
    let curso = await prisma.curso.findFirst({
      where: { nome: defaultCourseName },
    });

    // Se o curso genérico não existir, cria ele e a área de conhecimento genérica
    if (!curso) {
      const defaultAreaName = "Área Genérica";
      let area = await prisma.areaConhecimento.findFirst({
        where: { nome: defaultAreaName },
      });

      if (!area) {
        area = await prisma.areaConhecimento.create({
          data: { nome: defaultAreaName },
        });
      }
      
      curso = await prisma.curso.create({
        data: {
          nome: defaultCourseName,
          areasConhecimento: {
            connect: { id: area.id }
          }
        }
      });
    }
    idCurso = curso.id;
  }

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