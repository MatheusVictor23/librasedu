// src/services/AuthService.js
import { PrismaClient } from '../../generated/prisma/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
// Crie uma chave secreta para o JWT. Em produção, isto deve vir de uma variável de ambiente!
const JWT_SECRET = 'gf307';

const login = async (email, senha) => {
  // 1. Encontrar o utilizador pelo e-mail
  const user = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Credenciais inválidas'); // Mensagem genérica por segurança
  }

  // 2. Comparar a senha enviada com a hash guardada no banco
  const isPasswordValid = await bcrypt.compare(senha, user.senha);

  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
  }

  // 3. Se a senha for válida, gerar o token JWT
  const token = jwt.sign(
    { 
      userId: user.id, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '8h' } // O token expira em 8 horas
  );

  // Removemos a senha da resposta antes de a enviar
  const { senha: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export default {
  login,
};