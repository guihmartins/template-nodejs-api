import { Router } from 'express';
import userRoutes from './user.routes';

const routes = Router();

console.log('🛣️  Carregando rotas de usuário...');
routes.use('/user', userRoutes);

export default routes;
