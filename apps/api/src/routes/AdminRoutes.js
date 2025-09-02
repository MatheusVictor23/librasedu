// apps/api/src/routes/AdminRoutes.js
import { Router } from 'express';
// Importa as funções específicas do nosso controlador unificado
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

router.get('/stats', getDashboardStats);

// Aplica a segurança a todas as rotas deste ficheiro
router.use(protect, isAdmin);

// Rotas de Gestão de Utilizadores
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Rotas de Gestão de Avaliadores
router.get('/evaluators', getAllEvaluators);
router.post('/evaluators', createEvaluator);

// Rota para Instituições (usada nos formulários do frontend)
router.get('/instituicoes', getAllInstituicoes);

// Rotas para Consulta de Sinais
router.get('/sinais-propostos', getAllSinaisPropostos);
router.get('/sinais-oficiais', getAllSinaisOficiais);

router.get('/recent-users', getRecentUsers);
router.get('/proposals-by-day', getProposalsByDay);
router.get('/users-by-role', getUsersByRole);

// Agrupa todas as rotas acima sob o prefixo /admin
const adminRouter = Router();
adminRouter.use('/admin', router);

export default adminRouter;