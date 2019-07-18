const BlogModel = require('../models/Blog');

const publishNewBlog = async ( ctx, next ) => {
    let blog = ctx.request.body.blog;
    blog.publishTime = Date.now();
    blog.updateTime = Date.now();
    blog.see = 0;
    blog.like = 0;
    blog.comments = [];

    try {
        await BlogModel.publishBlog(blog);
        ctx.status = 200;
        ctx.body = {
            successMsg: '文章发表成功!'
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = {
            errMsg: '发表文章失败!',
            err
        }
    }

    await next();
}

const getAllBlog = async (ctx) => {
    try {
        let blogList = await BlogModel.getAllBlog();
        ctx.status = 200;
        ctx.body = {
            successMsg: '获取博客列表成功!',
            blogList
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = {
            errMsg: '获取博客列表失败!',
            err
        }
    }
}

const deleteBlog = async (ctx, next) => {
    try {
        let ids = ctx.request.body.ids;
        await BlogModel.deleteAllBlog(ids);
        
        ctx.status = 200;
        ctx.body = {
            successMsg: '删除博客成功!'
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = {
            errMsg: '删除博客失败!',
            err
        }
    }
    await next();
}
const updateBlog = async (ctx, next) => {
    try {
        let blog = ctx.request.body.blog;
        await BlogModel.updateBlog(blog._id, blog);
        ctx.status = 200;
        ctx.body = {
            successMsg: '更新博客成功!'
        }
    } catch (err) {
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