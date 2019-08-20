import Router from 'koa-router';
import CategoryController from '../controllers/categoryController';

const categoryRoute = new Router();

categoryRoute.post('/add', CategoryController.addCategory);
categoryRoute.get('/list', CategoryController.getAllCategory);

export default categoryRoute;
