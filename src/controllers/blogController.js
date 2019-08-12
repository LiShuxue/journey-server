const BlogModel = require('../models/Blog');
const sentry = require('../utils/sentry');

const publishNewBlog = async ( ctx, next ) => {
    sentry.addBreadcrumb('controllers/blogController.js --> publishNewBlog');
    let blog = ctx.request.body.blog;
    blog.publishTime = Date.now();
    blog.updateTime = Date.now();
    blog.see = 0;
    blog.like = 0;
    blog.comments = [];

    blog.image = Object.assign({name: '', url: ''}, blog.image)

    try {
        await BlogModel.publishBlog(blog);
        ctx.status = 200;
        ctx.body = {
            successMsg: '文章发表成功!'
        }
    } catch (err) {
        sentry.captureException(err);
        ctx.status = 500;
        ctx.body = {
            errMsg: '发表文章失败!',
            err
        }
    }

    await next();
}

const getAllBlog = async (ctx) => {
    sentry.addBreadcrumb('controllers/blogController.js --> getAllBlog');
    try {
        let blogList = await BlogModel.getAllBlog();
        ctx.status = 200;
        ctx.body = {
            successMsg: '获取博客列表成功!',
            blogList
        }
    } catch (err) {
        sentry.captureException(err);
        ctx.status = 500;
        ctx.body = {
            errMsg: '获取博客列表失败!',
            err
        }
    }
}

const deleteBlog = async (ctx, next) => {
    sentry.addBreadcrumb('controllers/blogController.js --> deleteBlog');
    try {
        let ids = ctx.request.body.ids;
        await BlogModel.deleteAllBlog(ids);
        
        ctx.status = 200;
        ctx.body = {
            successMsg: '删除博客成功!'
        }
    } catch (err) {
        sentry.captureException(err);
        ctx.status = 500;
        ctx.body = {
            errMsg: '删除博客失败!',
            err
        }
    }
    await next();
}
const updateBlog = async (ctx, next) => {
    sentry.addBreadcrumb('controllers/blogController.js --> updateBlog');
    try {
        let blog = ctx.request.body.blog;
        blog.image = Object.assign({name: '', url: ''}, blog.image)
        await BlogModel.updateBlog(blog._id, blog);
        ctx.status = 200;
        ctx.body = {
            successMsg: '更新博客成功!'
        }
    } catch (err) {
        sentry.captureException(err);
        ctx.status = 500;
        ctx.body = {
            errMsg: '更新博客失败!',
            err
        }
    }
    await next();
}

module.exports = {
    publishNewBlog,
    getAllBlog,
    deleteBlog,
    updateBlog
};