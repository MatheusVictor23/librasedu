import { Router } from 'express';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    updateProfile, // Importa o novo controlador
    deleteUser,
    getMyStats,
    getMyFavoritedSinais,
    getMySubmittedProposals
} from '../controllers/UserController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';


const router = Router();

// --- ROTAS PROTEGIDAS PARA DADOS DO PRÓPRIO USUÁRIO ('ME') ---
router.get('/users/me/stats', protect, getMyStats);
router.get('/users/me/favorites', protect, getMyFavoritedSinais);
router.get('/users/me/proposals', protect, getMySubmittedProposals);

/**
 * NOVO: Rota para o usuário logado atualizar o seu próprio perfil.
 * Utiliza o método PUT e é protegida para garantir autenticação.
 */
router.put('/users/profile', protect, updateProfile);


// --- ROTAS GERAIS / DE ADMIN ---
// A rota para criar um usuário é pública (cadastro)
router.post('/users', createUser); 

// Rotas que exigem autenticação (e algumas, permissão de admin)
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/users/:id', protect, isAdmin, getUserById); 
router.put('/users/:id', protect, isAdmin, updateUser); 
router.delete('/users/:id', protect, isAdmin, deleteUser); 

export default router;