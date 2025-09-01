// src/routes/UserRoutes.js
import { Router } from 'express';
import UserController from '../controllers/UserController.js';
// Já não precisamos dos middlewares aqui

const router = Router();

// Estas rotas agora são consideradas públicas ou para utilizadores autenticados (sem verificação de role)
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser); // O registo é público
router.put('/users/:id', UserController.updateUser); // Um utilizador pode atualizar o seu próprio perfil
router.delete('/users/:id', UserController.deleteUser); // Um utilizador pode apagar a sua própria conta

export default router;