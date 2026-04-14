// apps/api/src/routes/UserRoutes.js
import { Router } from 'express';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    updateProfile,
    deleteUser,
    getMyStats,
    getMySavedSinais, // Renomeado
    getMyLikedSinais, // Novo
    getMySubmittedProposals,
    getMyProfile
} from '../controllers/UserController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import { uploadAvatar } from '../middlewares/uploadMiddleware.js';

const router = Router();

// --- ROTAS PÚBLICAS ---
router.post('/users', uploadAvatar.single('avatar'), createUser); 

// --- ROTAS PROTEGIDAS PARA DADOS DO PRÓPRIO UTILIZADOR ('ME') ---
router.get('/users/me', protect, getMyProfile);
router.get('/users/me/stats', protect, getMyStats);
router.get('/users/me/saved', protect, getMySavedSinais); // Rota para sinais salvos
router.get('/users/me/liked', protect, getMyLikedSinais); // Nova rota para sinais curtidos
router.get('/users/me/proposals', protect, getMySubmittedProposals);
router.put('/users/profile', protect, uploadAvatar.single('avatar'), updateProfile);

// --- ROTAS DE ADMIN ---
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/users/:id', protect, isAdmin, getUserById); 
router.put('/users/:id', protect, isAdmin, updateUser); 
router.delete('/users/:id', protect, isAdmin, deleteUser); 

export default router;