import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

  const senha = await bcrypt.hash('123123', 10);

  await prisma.$transaction(async (tx) => {

  await tx.instituicao.create({
      data: {
        nome: 'Instituição Federal do Amazonas',
        sigla: 'IFAM CMC'
      },
    });

  await tx.usuario.createMany({
      data: [
        {
          nome: 'Matheus',
          cpf: '12345678900',
          email: 'matheus@gmail.com',
          senha: senha,
          role: 'ADMIN',
          idInstituicao: 1,
        },
        {
          nome: 'Gabriel',
          cpf: '98765432100',
          email: 'gabriel@gmail.com',
          senha: senha,
          role: 'USER',
          idInstituicao: 1,
        },
        {
          nome: 'Marcelo',
          cpf: '43765432143',
          email: 'marcelo@gmail.com',
          senha: senha,
          role: 'AVALIADOR',
          idInstituicao: 1,
        }
      ]
    });

  await tx.areaConhecimento.create({
      data: 
        {
          nome: "Computação"
        }
    });

  await tx.curso.create({
      data: {
        nome: "Tecnologia em Análise e Desenvolvimento de Sistemas",
        areasConhecimento: {
          connect: [
            { id: 1 }
          ],
        },
      },
    });

  await tx.disciplina.createMany({
      data: [
        {
          nome: "Banco de dados I",
          cargaHoraria: "60 horas",
          idCurso: 1
        },
        {
          nome: "Programação Orientada a Objetos",
          cargaHoraria: "80 horas",
          idCurso: 1
        }
      ]
    });

  await tx.sinalProposto.createMany({
      data: [
        {
          disciplinaId: 1,
          proposerId: 1,
          nome: "Modelagem de Dados",
          videoUrl: "https://youtu.be/J40w3xTbHTk?si=ktm1cXGqwMww4KMS",
          descricao: "Introdução à modelagem de dados em bancos relacionais"
        },
        {
          disciplinaId: 1,
          proposerId: 1,
          nome: "Consultas SQL",
          videoUrl: "https://youtu.be/J40w3xTbHTk?si=ktm1cXGqwMww4KMS",
          descricao: "Como escrever consultas SQL eficientes e corretas"
        },
        {
          disciplinaId: 1,
          proposerId: 1,
          nome: "SQL",
          videoUrl: "https://youtu.be/J40w3xTbHTk?si=ktm1cXGqwMww4KMS",
          descricao: "SQL (Structured Query Language) é uma linguagem padrão para gerenciar dados em bancos de dados relacionais, permitindo a criação, consulta, atualização e exclusão de informações de forma organizada e eficiente."
        },
        {
          disciplinaId: 2,
          proposerId: 1,
          nome: "Objeto",
          videoUrl: "https://youtu.be/phl0p4UF5AQ?si=Rfonc1fDabHIvmxN",
          descricao: "Um objeto é uma instância de uma classe, representando uma entidade que combina dados (chamados de propriedades ou atributos) e comportamento (chamados de métodos ou operações) para modelar o mundo real ou abstrato dentro de um programa."
        },
        {
          disciplinaId: 2,
          proposerId: 1,
          nome: "Classes",
          videoUrl: "https://youtu.be/phl0p4UF5AQ?si=Rfonc1fDabHIvmxN",
          descricao: "Uma classe é uma estrutura que define um tipo de objeto, incluindo seus atributos e métodos."
        },
        {
          disciplinaId: 2,
          proposerId: 1,
          nome: "Herança",
          videoUrl: "https://youtu.be/phl0p4UF5AQ?si=Rfonc1fDabHIvmxN",
          descricao: "Herança é um mecanismo que permite criar uma nova classe a partir de uma classe existente, aproveitando suas características e comportamentos."
        }
      ]
    });
    
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
