// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();
const JWT_SECRET = 'gf307'; // A mesma chave secreta do AuthService

/**
 * Middleware para proteger rotas. Verifica se o token JWT é válido.
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extrai o token do cabeçalho "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifica se o token é válido usando a nossa chave secreta
      const decoded = jwt.verify(token, JWT_SECRET);

      // 3. Busca o utilizador no banco de dados com o ID do token e anexa à requisição
      req.user = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, nome: true, role: true } // Selecionamos apenas os dados seguros
      });

      if (!req.user) {
         return res.status(401).json({ error: 'Utilizador não encontrado.' });
      }

      next(); // Se tudo estiver OK, avança para a próxima função (o controlador)
    } catch (error) {
      res.status(401).json({ error: 'Não autorizado, token inválido.' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Não autorizado, nenhum token fornecido.' });
  }
};

/**
 * Middleware para verificar se o utilizador é um Administrador.
 * Deve ser usado SEMPRE DEPOIS do middleware 'protect'.
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next(); 
  } else {
    res.status(403).json({ error: 'Acesso negado. Rota exclusiva para administradores.' });
  }
};