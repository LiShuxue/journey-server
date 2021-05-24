import Router from 'koa-router';
import commonController from '../controllers/commonController';

const commonRoute = new Router();

commonRoute.get('/oneinfo', commonController.getOneInfo);

export default commonRoute;
