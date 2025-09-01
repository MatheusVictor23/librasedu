// src/routes/AdminRoutes.js
import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

// Aplicamos os middlewares a todas as rotas neste ficheiro.
// Qualquer requisição para /admin/* primeiro passará pelo 'protect', depois pelo 'isAdmin'.
router.use(protect, isAdmin);

// --- Rotas de Gestão de Utilizadores ---

// Rota para listar todos os utilizadores (já existente no UserController)
router.get('/admin/users', UserController.getAllUsers);

// Rota para criar um novo utilizador (admin pode criar qualquer tipo)
router.post('/admin/users', UserController.createUser);

// Rota para obter detalhes de um utilizador específico
router.get('/admin/users/:id', UserController.getUserById);

// Rota para atualizar um utilizador
router.put('/admin/users/:id', UserController.updateUser);

// Rota para apagar um utilizador
router.delete('/admin/users/:id', UserController.deleteUser);

export default router;