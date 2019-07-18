const BlogController = require('../controllers/blogController.js');
const Router = require('koa-router');
const tokenUtil = require('../utils/tokenUtil');

const blogRoute = new Router();

blogRoute.post('/publish', tokenUtil.verifyAccessToken, BlogController.publishNewBlog, tokenUtil.returnNewToken);
blogRoute.get('/list', BlogController.getAllBlog);
blogRoute.post('/delete', tokenUtil.verifyAccessToken, BlogController.deleteBlog, tokenUtil.returnNewToken);
blogRoute.post('/update', tokenUtil.verifyAccessToken, BlogController.updateBlog, tokenUtil.returnNewToken);

module.exports = blogRoute;
