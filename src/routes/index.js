const Router = require('koa-router');
const router = new Router();

// 引入子路由
const userRoute = require('./userRoute');
const blogRoute = require('./blogRoute');
const qiniuRoute = require('./qiniuRoute')

// 路由中间件加载子路由
router.use('/blog-api/admin', userRoute.routes(), userRoute.allowedMethods());
router.use('/blog-api/blog', blogRoute.routes(), blogRoute.allowedMethods());
router.use('/blog-api/qiniu', qiniuRoute.routes(), qiniuRoute.allowedMethods());

module.exports = router;