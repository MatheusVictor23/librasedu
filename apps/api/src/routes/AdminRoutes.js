import { Router } from 'express';
import SinalController from '../controllers/SinalController.js';
import SinalPropostoController from '../controllers/SinalPropostoController.js';
import SolicitacaoController from '../controllers/SolicitacaoController.js'; 
import InstituicaoController from '../controllers/InstituicaoController.js';
import { 
    getAllUsers, 
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getAllEvaluators,
    createEvaluator,
    getAllInstituicoes,
    getAllSinaisPropostos,
    getAllSinaisOficiais,
    getDashboardStats,
    getProposalsByDay,
    getRecentUsers,
    getUsersByRole
} from '../controllers/UserController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Middleware de proteção e autorização para todas as rotas de admin
router.use(protect); 
router.use(isAdmin);

// Rotas de Dashboard
router.get('/stats', getDashboardStats);
router.get('/recent-users', getRecentUsers);
router.get('/proposals-by-day', getProposalsByDay);
router.get('/users-by-role', getUsersByRole);

// Rotas de Gestão de Usuários
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Rotas de Gestão de Avaliadores
router.get('/evaluators', getAllEvaluators);
router.post('/evaluators', createEvaluator);

// Rotas de Gestão de Instituições
router.get('/instituicoes', getAllInstituicoes);
router.post('/instituicoes', InstituicaoController.createInstituicao);
router.put('/instituicoes/:id', InstituicaoController.updateInstituicao);
router.delete('/instituicoes/:id', InstituicaoController.deleteInstituicao);

// Rotas de Gestão de Sinais e Propostas
router.get('/sinais-propostos', getAllSinaisPropostos);
router.get('/sinais-oficiais', getAllSinaisOficiais);
router.get('/proposals/approved-unpublished', SinalPropostoController.getApprovedUnpublishedProposals);
router.post('/proposals/:id/publish', SinalController.publishSinal);

// 2. NOVAS ROTAS DE GESTÃO DE SOLICITAÇÕES
router.get('/solicitacoes/pendentes', SolicitacaoController.getAllPendingSolicitacoes);
router.post('/solicitacoes/vinculo/:id/manage', SolicitacaoController.manageSolicitacaoVinculo);
router.post('/solicitacoes/instituicao/:id/manage', SolicitacaoController.manageSolicitacaoInstituicao);


const adminRouter = Router();
adminRouter.use('/admin', router);

export default adminRouter;