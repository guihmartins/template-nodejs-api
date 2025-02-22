import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser, search } from '@controllers/user.controller';

const userRoutes = Router();

// Rotas agora serão acessadas como /api/user/...

userRoutes.get('/', getUsers);
userRoutes.get('/search', search);  // Movida para antes da rota com :id
userRoutes.get('/:id', getUserById);

userRoutes.post('/', createUser);
userRoutes.put('/:id', updateUser);
userRoutes.delete('/:id', deleteUser);

export default userRoutes;