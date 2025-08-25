import { Router } from 'express';
import DisciplinaController from '../controllers/DisciplinaController.js';

const router = Router();

router.get('/disciplinas', DisciplinaController.getAllDisciplinas);
router.post('/disciplinas', DisciplinaController.createDisciplina);

export default router;