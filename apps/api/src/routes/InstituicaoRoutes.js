import { Router } from 'express';
import InstituicaoController from '../controllers/InstituicaoController.js';

const router = Router();

router.get('/instituicoes', InstituicaoController.getAllInstituicoes);
router.post('/instituicoes', InstituicaoController.createInstituicao);

export default router;