import { Router } from 'express';
import UserRoutes from './UserRoutes.js';
import InstituicaoRoutes from './InstituicaoRoutes.js';
import AreaConhecimentoRoutes from './AreaConhecimentoRoutes.js';
import CursoRoutes from './CursoRoutes.js';
import DisciplinaRoutes from './DisciplinaRoutes.js';
import SinalPropostoRoutes from './SinalPropostoRoutes.js';
import SinalRoutes from './SinalRoutes.js'; 
import AuthRoutes from './AuthRoutes.js';
import AdminRoutes from './AdminRoutes.js';
import EvaluatorRoutes from './EvaluatorRoutes.js';
import SolicitacaoRoutes from './SolicitacaoRoutes.js'; // 1. Importar as novas rotas

const router = Router();

router.use(AuthRoutes);
router.use(UserRoutes);
router.use(InstituicaoRoutes);
router.use(AreaConhecimentoRoutes);
router.use(CursoRoutes);
router.use(DisciplinaRoutes);
router.use(SinalPropostoRoutes);
router.use(SinalRoutes); 
router.use(AdminRoutes);
router.use(EvaluatorRoutes);
router.use(SolicitacaoRoutes); // 2. Adicionar as novas rotas

export default router;