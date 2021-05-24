import Router from 'koa-router';
import commonController from '../controllers/commonController';

const commonRoute = new Router();

commonRoute.get('/homeinfo', commonController.getHomeInfo);

export default commonRoute;
