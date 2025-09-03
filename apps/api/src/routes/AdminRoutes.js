import { Router } from 'express';
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

router.use(protect); 
router.use(isAdmin);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/evaluators', getAllEvaluators);
router.post('/evaluators', createEvaluator);

router.get('/instituicoes', getAllInstituicoes);

router.get('/sinais-propostos', getAllSinaisPropostos);
router.get('/sinais-oficiais', getAllSinaisOficiais);

router.get('/recent-users', getRecentUsers);
router.get('/proposals-by-day', getProposalsByDay);
router.get('/users-by-role', getUsersByRole);

const adminRouter = Router();
adminRouter.use('/admin', router);

export default adminRouter;