import { Router } from 'express';
import {createUsers, login} from '../controllers/users' 

const userRouter = Router();

userRouter.post('/create-users', createUsers);
userRouter.post('/login', login);

export default userRouter;
