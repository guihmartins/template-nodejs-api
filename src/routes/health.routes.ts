import { Router } from 'express';
import { getUsers} from '@controllers/user.controller';

const healthRoutes = Router();


healthRoutes.get("/", getUsers);


export default healthRoutes;