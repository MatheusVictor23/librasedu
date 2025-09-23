import { Router } from 'express';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser,
    getMyStats,
    getMyFavoritedSinais,
    getMySubmittedProposals
} from '../controllers/UserController.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = Router();

// --- NOVAS ROTAS PROTEGIDAS ---
router.get('/users/me/stats', protect, getMyStats);
router.get('/users/me/favorites', protect, getMyFavoritedSinais);
router.get('/users/me/proposals', protect, getMySubmittedProposals);


// Rotas existentes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser); 
router.put('/users/:id', updateUser); 
router.delete('/users/:id', deleteUser); 

export default router;
