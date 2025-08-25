import { Router } from 'express';
import SinalPropostoController from '../controllers/SinalPropostoController.js';

const router = Router();

router.get('/sinais-propostos', SinalPropostoController.getAllSinaisPropostos);
router.post('/sinais-propostos', SinalPropostoController.createSinalProposto);

export default router;