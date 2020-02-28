import BlogModel, { IBlog, ISimpleBlog } from '../models/Blog';
import sentry from '../utils/sentry';
import { Context } from 'koa';

const publishNewBlog = async ( ctx: Context ): Promise<any> => {
    sentry.addBreadcrumb('controllers/blogController.js --> publishNewBlog');
    let blog: IBlog = ctx.request.body.blog;
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
}

const getAllBlog = async ( ctx: Context ): Promise<any> => {
    sentry.addBreadcrumb('controllers/blogController.js --> getAllBlog');
    try {
        let blogList: ISimpleBlog[] = await BlogModel.getAllBlog();
        ctx.status = 200;
        ctx.body = {
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

const getBlogDetailById = async ( ctx: Context ): Promise<any> => {
    sentry.addBreadcrumb('controllers/blogController.js --> getBlogDetailById');
    try {
        let id: string = ctx.request.query.id;
        let blog: IBlog = await BlogModel.getBlogDetailById(id);
        await BlogModel.updateSeeAccount(blog);
        ctx.status = 200;
        ctx.body = {
            blog
        }
    } catch (err) {
        sentry.captureException(err);
        ctx.status = 500;
        ctx.body = {
            errMsg: '获取博客详细信息失败!',
            err
        }
    }
}

const deleteBlog = async ( ctx: Context ): Promise<any> => {
    sentry.addBreadcrumb('controllers/blogController.js --> deleteBlog');
    try {
        let ids: string[] = ctx.request.body.ids;
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
}

const updateBlog = async ( ctx: Context ): Promise<any> => {
    sentry.addBreadcrumb('controllers/blogController.js --> updateBlog');
    try {
        let blog: IBlog = ctx.request.body.blog;
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
}

const updateLikeAccount = async ( ctx: Context ): Promise<any> => {
    sentry.addBreadcrumb('controllers/blogController.js --> updateLikeAccount');

    let errMsg = '';
    try {
        let id: string = ctx.request.body.id;
        let isLiked: boolean = ctx.request.body.isLiked;
        let blog: IBlog = await BlogModel.getBlogDetailById(id);

        let newLikeAccount = blog.like;
        if (isLiked) {
            newLikeAccount = blog.like + 1;
            errMsg = '点赞失败!';
        } else {
            if (newLikeAccount >= 1) {
                newLikeAccount = blog.like - 1;
            }
            errMsg = '取消点赞失败!';
        }

        await BlogModel.updateLikeAccount(blog, newLikeAccount);

        ctx.status = 200;
        ctx.body = {}
    } catch (err) {
        sentry.captureException(err);
        ctx.status = 500;
        ctx.body = {
            errMsg,
            err
        }
    }
}

export default {
    publishNewBlog,
    getAllBlog,
    deleteBlog,
    updateBlog,
    getBlogDetailById,
    updateLikeAccount
};