import { Router } from 'express';
import SinalPropostoController from '../controllers/SinalPropostoController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/sinais-propostos', SinalPropostoController.getAllSinaisPropostos);
router.post('/sinais-propostos', protect, SinalPropostoController.createSinalProposto);

export default router;