import Router from 'koa-router';

// 引入子路由
import userRoute from './userRoute';
import blogRoute from './blogRoute';
import qiniuRoute from './qiniuRoute';
import commonRoute from './commonRoute';

const router = new Router();

// 路由中间件加载子路由
router.use('/blog-api/admin', userRoute.routes(), userRoute.allowedMethods());
router.use('/blog-api/blog', blogRoute.routes(), blogRoute.allowedMethods());
router.use('/blog-api/qiniu', qiniuRoute.routes(), qiniuRoute.allowedMethods());
router.use('/blog-api/common', commonRoute.routes(), qiniuRoute.allowedMethods());

export default router;
