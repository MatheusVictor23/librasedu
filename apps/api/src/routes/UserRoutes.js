// apps/api/src/routes/UserRoutes.js
import { Router } from 'express';
// MUDANÇA AQUI: Importamos as funções específicas com chaves {}
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from '../controllers/UserController.js';

const router = Router();

// Estas rotas agora são consideradas públicas ou para utilizadores autenticados
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser); // O registo é público
router.put('/users/:id', updateUser); // Um utilizador pode atualizar o seu próprio perfil
router.delete('/users/:id', deleteUser); // Um utilizador pode apagar a sua própria conta

export default router;