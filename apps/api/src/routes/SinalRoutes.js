// apps/api/src/routes/SinalRoutes.js
import { Router } from 'express';
import SinalController from '../controllers/SinalController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/sinais/trending', protect, SinalController.getTrendingSinais);
router.get('/sinais/recent', protect, SinalController.getRecentSinais);
router.get('/sinais/recommended', protect, SinalController.getRecommendedSinais);

router.get('/sinais', protect, SinalController.getAllSinais); 
router.post('/sinais', protect, SinalController.createSinal);

router.get('/sinais/:id', protect, SinalController.getSinalById);

// Rotas de interação
router.post('/sinais/:id/like', protect, SinalController.likeSinal);
router.delete('/sinais/:id/like', protect, SinalController.unlikeSinal);
router.post('/sinais/:id/save', protect, SinalController.saveSinal);
router.delete('/sinais/:id/save', protect, SinalController.unsaveSinal);

// --- ROTAS PARA COMENTÁRIOS ---
router.get('/sinais/:id/comentarios', protect, SinalController.getComentarios);
router.post('/sinais/:id/comentarios', protect, SinalController.addComentario);

export default router;