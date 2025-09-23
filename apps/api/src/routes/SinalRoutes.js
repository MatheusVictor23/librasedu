import { Router } from 'express';
import SinalController from '../controllers/SinalController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// --- NOVAS ROTAS PÚBLICAS ---
// Estas rotas precisam de vir ANTES da rota geral /sinais para serem correspondidas corretamente.
router.get('/sinais/trending', SinalController.getTrendingSinais);
router.get('/sinais/recent', SinalController.getRecentSinais);
router.get('/sinais/recommended', SinalController.getRecommendedSinais);

// --- ROTAS EXISTENTES ---
// A rota geral /sinais agora também lida com a pesquisa através de query params.
router.get('/sinais', SinalController.getAllSinais); 
router.post('/sinais', protect, SinalController.createSinal);

export default router;