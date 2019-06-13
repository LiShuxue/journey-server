const BlogController = require('../controllers/blogController.js');
const CategoryController = require('../controllers/categoryController');
const Router = require('koa-router');
const tokenUtil = require('../utils/tokenUtil');
// multer：该中间件用于处理multipart/form-data类型的数据
// const multer = require('koa-multer');
// const upload = multer({ dest: 'static/' });

const blogRoute = new Router();

blogRoute.post('/publish', tokenUtil.verifyAccessToken, BlogController.publishNewBlog, tokenUtil.returnNewToken);
blogRoute.post('/category/add', tokenUtil.verifyAccessToken, CategoryController.addCategory, tokenUtil.returnNewToken);
blogRoute.get('/category/list', CategoryController.getAllCategory);
// upload.single('file')，接受一个以 file 命名的文件（我发请求的时候用这个命名的图片），然后保存在req.file中
// blogRoute.post('/uploadImage', tokenUtil.verifyAccessToken, upload.single('file'), BlogController.saveImage, tokenUtil.returnNewToken);
// blogRoute.post('/removeImage', tokenUtil.verifyAccessToken, BlogController.removeImage, tokenUtil.returnNewToken);

blogRoute.get('/list', BlogController.getAllBlog);
// blogRoute.get('/hot', BlogController.getHotBlog);
// blogRoute.get('/tag/list', BlogController.getAllTags);

module.exports = blogRoute;
