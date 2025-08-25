import { Router } from 'express';
import SinalController from '../controllers/SinalController.js';

const router = Router();

router.get('/sinais', SinalController.getAllSinais);
router.post('/sinais', SinalController.createSinal);

export default router;