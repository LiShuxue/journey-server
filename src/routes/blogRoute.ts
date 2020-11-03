import Router from 'koa-router';
import BlogController from '../controllers/blogController.js';

const blogRoute = new Router();

blogRoute.post('/publish', BlogController.publishNewBlog);
blogRoute.get('/list', BlogController.getAllBlog);
blogRoute.get('/detail', BlogController.getBlogDetailById);
blogRoute.post('/delete', BlogController.deleteBlog);
blogRoute.post('/update', BlogController.updateBlog);
blogRoute.post('/like', BlogController.updateLikeAccount);
blogRoute.post('/comment/add', BlogController.addComments);
blogRoute.post('/comment/hide', BlogController.hideComments);
blogRoute.post('/comment/delete', BlogController.deleteComments);

export default blogRoute;
