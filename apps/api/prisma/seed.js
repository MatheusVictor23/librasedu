import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {

  const instituicao = await prisma.instituicao.create({
    data: {
      nome: 'Instituição Federal do Amazonas',
      sigla: 'IFAM CMC'
    },
  });

  // Exemplo: criar usuários iniciais
  const user1 = await prisma.usuario.create({
    data: {
      nome: 'Matheus',
      cpf: '12345678900',
      email: 'matheus@gmail.com',
      senha: '123456',
      role: 'ADMIN',
      idInstituicao: 1,
    },
  });

  const user2 = await prisma.usuario.create({
    data: {
      nome: 'Outro Usuário',
      cpf: '98765432100',
      email: 'usuario@example.com',
      senha: '123456',
      role: 'USER',
      idInstituicao: 1,
    },
  });



  const areaConhecimento = await prisma.areaConhecimento.create({
    data: {
      nome: "Computação"
    }
  });

  const curso = await prisma.curso.create({
    data: {
      nome: "Tecnologia em Análise e Desenvolvimento de Sistemas",
      areasConhecimento: {
        connect: [
          { id: 1 }
        ],
      },
    },
  });

  const disciplina = await prisma.disciplina.create({
    data: {
      nome: "Banco de dados I",
      cargaHoraria: "60 horas",
      idCurso: 1
    }
  });


const sinalProposto01 = await prisma.sinalProposto.create({
  data: {
    disciplinaId: 1,
    proposerId: 1,
    nome: "Modelagem de Dados",
    videoUrl: "https://youtu.be/J40w3xTbHTk?si=ktm1cXGqwMww4KMS",
    descricao: "Introdução à modelagem de dados em bancos relacionais"
  }
});


const sinalProposto02 = await prisma.sinalProposto.create({
  data: {
    disciplinaId: 1,
    proposerId: 1,
    nome: "Consultas SQL",
    videoUrl: "https://youtu.be/J40w3xTbHTk?si=ktm1cXGqwMww4KMS",
    descricao: "Como escrever consultas SQL eficientes e corretas"
  }
});


const sinalProposto03 = await prisma.sinalProposto.create({
  data: {
    disciplinaId: 1,
    proposerId: 1,
    nome: "Normalização",
    videoUrl: "https://youtu.be/J40w3xTbHTk?si=ktm1cXGqwMww4KMS",
    descricao: "Conceitos e prática de normalização de tabelas"
  }
});

  console.log({ user1, user2, instituicao, areaConhecimento, curso, disciplina, sinalProposto01, sinalProposto02, sinalProposto03 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
