import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();
const JWT_SECRET = 'gf307'; 

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, nome: true, role: true }
      });

      if (!req.user) {
        return res.status(401).json({ error: 'Utilizador associado ao token não encontrado.' });
      }
      
      next(); 
    } catch (error) {
      return res.status(401).json({ error: 'Não autorizado, token inválido ou expirado.' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado, nenhum token fornecido.' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Rota exclusiva para administradores.' });
  }
};

export const isEvaluator = (req, res, next) => {
  if (req.user && (req.user.role === 'AVALIADOR' || req.user.role === 'ADMIN')) {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Rota exclusiva para avaliadores.' });
  }
};

export const isAuthenticated = protect;