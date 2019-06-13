const Router = require('koa-router');
const tokenUtil = require('../utils/tokenUtil');
const qiniuController = require('../controllers/qiniuController');

const qiniuRoute = new Router();

qiniuRoute.get('/uploadToken', tokenUtil.verifyAccessToken, qiniuController.getQiniuUploadToken, tokenUtil.returnNewToken);
qiniuRoute.post('/removeImage', tokenUtil.verifyAccessToken, qiniuController.deleteFile, tokenUtil.returnNewToken);

module.exports = qiniuRoute;

