import { Router } from 'express';
import SinalController from '../controllers/SinalController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Estas rotas precisam vir ANTES da rota geral /sinais/:id para serem correspondidas corretamente.
router.get('/sinais/trending', SinalController.getTrendingSinais);
router.get('/sinais/recent', SinalController.getRecentSinais);
router.get('/sinais/recommended', SinalController.getRecommendedSinais);

// A rota geral /sinais agora também lida com a pesquisa através de query params.
router.get('/sinais', protect, SinalController.getAllSinais); 
router.post('/sinais', protect, SinalController.createSinal);

/**
 * NOVO: Rota para buscar um sinal específico pelo seu ID.
 * A proteção 'protect' garante que apenas usuários logados possam acessar.
 */
router.get('/sinais/:id', protect, SinalController.getSinalById);

export default router;