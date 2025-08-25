import { Router } from 'express';
import AreaConhecimentoController from '../controllers/AreaConhecimentoController.js';

const router = Router();

router.get('/areas-conhecimento', AreaConhecimentoController.getAllAreas);
router.post('/areas-conhecimento', AreaConhecimentoController.createArea);

export default router;