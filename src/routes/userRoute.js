const UserController = require('../controllers/userController.js');
const Router = require('koa-router');
const tokenUtil = require('../utils/tokenUtil');

const userRoute = new Router();

userRoute.post('/login', UserController.login);
userRoute.post('/register', UserController.register);
userRoute.get('/list', tokenUtil.verifyAccessToken, UserController.userList, tokenUtil.returnNewToken);
userRoute.post('/delete', tokenUtil.verifyAccessToken, UserController.deleteUser, tokenUtil.returnNewToken);
userRoute.post('/update', tokenUtil.verifyAccessToken, UserController.updateUser, tokenUtil.returnNewToken);

module.exports = userRoute;
