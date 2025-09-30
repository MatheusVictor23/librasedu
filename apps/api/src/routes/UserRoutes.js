import { Router } from 'express';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    updateProfile,
    deleteUser,
    getMyStats,
    getMyFavoritedSinais,
    getMySubmittedProposals,
    getMyProfile
} from '../controllers/UserController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import { uploadAvatar } from '../middlewares/uploadMiddleware.js';

const router = Router();

// --- ROTAS PÚBLICAS ---
router.post('/users', uploadAvatar.single('avatar'), createUser); 

// --- ROTAS PROTEGIDAS PARA DADOS DO PRÓPRIO UTILIZADOR ('ME') ---
// CORREÇÃO: Esta rota específica deve vir ANTES da rota genérica com :id
router.get('/users/me', protect, getMyProfile);
router.get('/users/me/stats', protect, getMyStats);
router.get('/users/me/favorites', protect, getMyFavoritedSinais);
router.get('/users/me/proposals', protect, getMySubmittedProposals);
router.put('/users/profile', protect, uploadAvatar.single('avatar'), updateProfile);

// --- ROTAS DE ADMIN ---
// Esta rota genérica com :id vem DEPOIS das rotas 'me'
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/users/:id', protect, isAdmin, getUserById); 
router.put('/users/:id', protect, isAdmin, updateUser); 
router.delete('/users/:id', protect, isAdmin, deleteUser); 

export default router;