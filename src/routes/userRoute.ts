import Router from 'koa-router';
import UserController from '../controllers/userController.js';

const userRoute = new Router();

userRoute.post('/login', UserController.login);
userRoute.post('/register', UserController.register);
userRoute.get('/list', UserController.userList);
userRoute.post('/delete', UserController.deleteUser);
userRoute.post('/update', UserController.updateUser);

export default userRoute;
