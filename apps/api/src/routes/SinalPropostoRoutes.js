import { Router } from 'express';
import SinalPropostoController from '../controllers/SinalPropostoController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/sinais-propostos', SinalPropostoController.getAllSinaisPropostos);
router.post('/sinais-propostos', SinalPropostoController.createSinalProposto);
router.put('/sinais-propostos/:id', SinalPropostoController.putSinalProposto);

export default router;