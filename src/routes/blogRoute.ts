import Router from 'koa-router';
import BlogController from '../controllers/blogController.js';

const blogRoute = new Router();

blogRoute.post('/publish', BlogController.publishNewBlog);
blogRoute.get('/list', BlogController.getAllBlog);
blogRoute.get('/detail', BlogController.getBlogDetailById);
blogRoute.post('/delete', BlogController.deleteBlog);
blogRoute.post('/update', BlogController.updateBlog);

export default blogRoute;
