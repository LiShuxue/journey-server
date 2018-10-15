const UserController = require('../controllers/userController.js');
const Router = require('koa-router');

const userRoute = new Router();

userRoute.post('/login', UserController.login);
userRoute.post('/register', UserController.register);

module.exports = userRoute;
