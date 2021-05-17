import crypto from 'crypto';
import BlogModel, { IBlog, ISimpleBlog, IComment, IReply } from '../models/Blog';
import sentry from '../utils/sentry';
import { Context } from 'koa';

const publishNewBlog = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/blogController.js --> publishNewBlog');
  try {
    let blog: IBlog = ctx.request.body.blog;
    blog.publishTime = Date.now();
    blog.updateTime = Date.now();
    blog.see = 0;
    blog.like = 0;
    blog.comments = [];

    blog.image = Object.assign({ name: '', url: '' }, blog.image);

    await BlogModel.publishBlog(blog);
    ctx.status = 200;
    ctx.body = {
      successMsg: '文章发表成功!'
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '发表文章失败!',
      err
    };
  }
};

const getAllBlog = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/blogController.js --> getAllBlog');
  try {
    let blogList: ISimpleBlog[] = await BlogModel.getAllBlog();
    ctx.status = 200;
    ctx.body = {
      blogList
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '获取博客列表失败!',
      err
    };
  }
};

const getBlogDetailById = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/blogController.js --> getBlogDetailById');
  try {
    let id: string = ctx.request.query.id;
    let blog: IBlog = await BlogModel.getBlogDetailById(id);
    await BlogModel.updateSeeAccount(blog);
    ctx.status = 200;
    ctx.body = {
      blog
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '获取博客详细信息失败!',
      err
    };
  }
};

const deleteBlog = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/blogController.js --> deleteBlog');
  try {
    let ids: string[] = ctx.request.body.ids;
    await BlogModel.deleteAllBlog(ids);

    ctx.status = 200;
    ctx.body = {
      successMsg: '删除博客成功!'
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '删除博客失败!',
      err
    };
  }
};

const updateBlog = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/blogController.js --> updateBlog');
  try {
    let blog: IBlog = ctx.request.body.blog;
    blog.image = Object.assign({ name: '', url: '' }, blog.image);
    await BlogModel.updateBlog(blog._id, blog);
    ctx.status = 200;
    ctx.body = {
      successMsg: '更新博客成功!'
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '更新博客失败!',
      err
    };
  }
};

const updateLikeAccount = async (ctx: Context): Promise<any> => {
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
    ctx.body = {};
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg,
      err
    };
  }
};

const findCommentById = (comments: any[], id: string): any => {
  let result = null;
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === id) {
      result = comments[i];
      break;
    } else {
      result = findCommentById(comments[i].reply, id);
      if (result) break;
    }
  }
  return result;
};
const addComments = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/blogController.js --> addComments');
  try {
    const blogId: string = ctx.request.body.blog_id;
    const replyName: string = ctx.request.body.replyName;
    const parentId: string = ctx.request.body.parent_id;
    const comment: any = ctx.request.body.comment;
    const random = crypto.randomBytes(16).toString('hex');
    comment.id = `${Date.now()}${random}`;
    comment.date = Date.now();
    comment.reply = [];
    comment.isHide = false;

    const blog: IBlog = await BlogModel.getBlogDetailById(blogId);
    const existingComments: IComment[] = blog.comments;

    // 如果有replyName， 说明是回复另一个评论， 而不是一个新的评论
    if (replyName) {
      const originalComment: IComment = findCommentById(existingComments, parentId);
      comment.replyName = replyName;
      comment.parentId = parentId;
      originalComment.reply.push(comment as IReply);
    } else {
      // 放在数组开头
      existingComments.unshift(comment as IComment);
    }

    await BlogModel.updateComments(blog, existingComments);

    ctx.status = 200;
    ctx.body = {
      successMsg: '评论成功!'
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '评论失败!',
      err
    };
  }
};

const hideComments = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/blogController.js --> hideComments');
  try {
    const blogId: string = ctx.request.body.blog_id;
    const commentId: string = ctx.request.body.commentId;
    const blog: IBlog = await BlogModel.getBlogDetailById(blogId);
    const existingComments: IComment[] = blog.comments;

    const originalComment: any = findCommentById(existingComments, commentId);
    originalComment.isHide = true;

    await BlogModel.updateComments(blog, existingComments);

    ctx.status = 200;
    ctx.body = {
      successMsg: '隐藏成功!'
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '隐藏失败!',
      err
    };
  }
};

const deleteCommentById = (comments: any[], id: string): any => {
  let result = null;
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === id) {
      result = comments.splice(i, 1);
      break;
    } else {
      result = deleteCommentById(comments[i].reply, id);
      if (result) break;
    }
  }
  return result;
};
const deleteComments = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/blogController.js --> deleteComments');
  try {
    const blogId: string = ctx.request.body.blog_id;
    const commentId: string = ctx.request.body.commentId;
    const blog: IBlog = await BlogModel.getBlogDetailById(blogId);
    const existingComments: IComment[] = blog.comments;

    deleteCommentById(existingComments, commentId);

    await BlogModel.updateComments(blog, existingComments);

    ctx.status = 200;
    ctx.body = {
      successMsg: '删除成功!'
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '删除失败!',
      err
    };
  }
};

export default {
  publishNewBlog,
  getAllBlog,
  deleteBlog,
  updateBlog,
  getBlogDetailById,
  updateLikeAccount,
  addComments,
  hideComments,
  deleteComments
};
