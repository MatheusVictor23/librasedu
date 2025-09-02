// apps/api/src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();
const JWT_SECRET = 'gf307';

export const protect = async (req, res, next) => {
  console.log('--- MIDDLEWARE PROTECT INICIADO ---');
  let token;

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      console.log('1. Cabeçalho de autorização encontrado.');
      
      // 1. Extrai o token
      token = req.headers.authorization.split(' ')[1];
      console.log('2. Token extraído:', token);

      if (!token) {
        console.log('ERRO: Token não encontrado após o split.');
        return res.status(401).json({ error: 'Não autorizado, formato do token inválido.' });
      }

      // 2. Verifica se o token é válido
      console.log('3. A tentar verificar o token com jwt.verify...');
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('4. Token verificado com sucesso. Conteúdo:', decoded);

      // 3. Busca o utilizador no banco de dados
      console.log('5. A buscar utilizador no banco de dados com ID:', decoded.userId);
      req.user = await prisma.usuario.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, nome: true, role: true }
      });
      
      if (!req.user) {
        console.log('ERRO: Utilizador não encontrado na base de dados para o ID do token.');
        return res.status(401).json({ error: 'Utilizador não encontrado.' });
      }

      console.log('6. Utilizador encontrado e anexado à requisição:', req.user);
      console.log('--- MIDDLEWARE PROTECT CONCLUÍDO COM SUCESSO ---');
      next();
    } else {
      console.log('ERRO: Nenhum cabeçalho de autorização "Bearer" encontrado.');
      res.status(401).json({ error: 'Não autorizado, nenhum token fornecido.' });
    }
  } catch (error) {
    console.error('!!! ERRO CRÍTICO NO MIDDLEWARE PROTECT !!!');
    console.error('Nome do Erro:', error.name);
    console.error('Mensagem do Erro:', error.message);
    console.error('Stack do Erro:', error.stack);
    res.status(401).json({ error: 'Não autorizado, token falhou na verificação.', details: error.message });
  }
};


export const isAdmin = (req, res, next) => {
  console.log('--- MIDDLEWARE ISADMIN INICIADO ---');
  if (req.user && req.user.role === 'ADMIN') {
    console.log('Verificação de Admin: SUCESSO. Utilizador é ADMIN.');
    console.log('--- MIDDLEWARE ISADMIN CONCLUÍDO ---');
    next();
  } else {
    console.log('Verificação de Admin: FALHOU. Utilizador não é ADMIN ou não existe.');
    console.log('Conteúdo de req.user:', req.user);
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