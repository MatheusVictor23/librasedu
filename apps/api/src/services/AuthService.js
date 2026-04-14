import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'gf307';

const login = async (email, senha) => {
  const user = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Credenciais inválidas'); 
  }

  const isPasswordValid = await bcrypt.compare(senha, user.senha);

  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
  }

  const token = jwt.sign(
    { 
      userId: user.id, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '8h' } 
  );

  const { senha: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export default {
  login,
};