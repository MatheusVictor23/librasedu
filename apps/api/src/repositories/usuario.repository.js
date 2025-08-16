import prisma from '../config/prisma.js';

export const userRepository = {
    get: () => prisma.user.findMany(),
    getById: (id) => prisma.user.findUnique({where: {id: Number(id)} }),
    getByEmail: (email) => prisma.user.findUnique({where: { email }}),
    getByCpf: (cpf) => prisma.user.findUnique({where: { cpf }}),
    create: (data) => prisma.user.create({data}),
    update: (id, data) => prisma.update({where: {id: Number(id)}, data }),
    delete: (id) => prisma.user.delete({where: {id: Number(id)} })
}