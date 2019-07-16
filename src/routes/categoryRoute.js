const CategoryController = require('../controllers/categoryController');
const Router = require('koa-router');
const tokenUtil = require('../utils/tokenUtil');

const categoryRoute = new Router();

categoryRoute.post('/add', tokenUtil.verifyAccessToken, CategoryController.addCategory, tokenUtil.returnNewToken);
categoryRoute.get('/list', CategoryController.getAllCategory);

module.exports = categoryRoute;
