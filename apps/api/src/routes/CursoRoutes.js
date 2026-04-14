import { Router } from 'express';
import CursoController from '../controllers/CursoController.js';

const router = Router();

router.get('/cursos', CursoController.getAllCursos);
router.post('/cursos', CursoController.createCurso);

export default router;