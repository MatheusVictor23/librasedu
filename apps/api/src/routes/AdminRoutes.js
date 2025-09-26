import { Router } from 'express';
import SinalController from '../controllers/SinalController.js'; 
import SinalPropostoController from '../controllers/SinalPropostoController.js'; 
import { 
    getAllUsers, 
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getAllEvaluators,
    createEvaluator,
    getAllInstituicoes,
    getAllSinaisPropostos, // Esta rota ainda é necessária para a lista de pendentes
    getAllSinaisOficiais,
    getDashboardStats,
    getProposalsByDay,
    getRecentUsers,
    getUsersByRole
} from '../controllers/UserController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

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

// Rotas de Gestão de Sinais
router.get('/sinais-propostos', getAllSinaisPropostos);
router.get('/sinais-oficiais', getAllSinaisOficiais);

// ROTA CORRIGIDA: Adiciona o endpoint para buscar propostas aprovadas e não publicadas
router.get('/proposals/approved-unpublished', SinalPropostoController.getApprovedUnpublishedProposals);
router.post('/proposals/:id/publish', SinalController.publishSinal);


const adminRouter = Router();
adminRouter.use('/admin', router);

export default adminRouter;