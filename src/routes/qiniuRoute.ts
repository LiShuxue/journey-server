import Router from 'koa-router';
import qiniuController from '../controllers/qiniuController';

const qiniuRoute = new Router();

qiniuRoute.get('/uploadToken', qiniuController.getQiniuUploadToken);
qiniuRoute.post('/removeImage', qiniuController.deleteFile);

export default qiniuRoute;
