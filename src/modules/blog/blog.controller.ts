import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MyLoggerService } from '../logger/logger.service';
import { BlogService } from './blog.service';
import { IdValidationPipe } from 'src/pipes/idValidation.pipe';
import { CommentDto, CreateBlogDto, UpdateBlogDto } from './blog.dto';
import { Types } from 'mongoose';
import { randomBytes } from 'node:crypto';
import { Reply, Comment } from './blog.schema';
import { EmailService } from '../email/email.service';

@Controller('blog')
export class BlogController {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly blogService: BlogService,
    private readonly emailService: EmailService,
  ) {
    this.myLogger.setContext('BlogController');
  }

  @Get('list')
  async getBlogList() {
    this.myLogger.log('getBlogList method');

    try {
      const blogList = await this.blogService.getBlogList();
      return blogList;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('detail')
  async getBlogDetail(@Query('id', IdValidationPipe) id: Types.ObjectId) {
    this.myLogger.log('getBlogDetail method');

    try {
      const blog = await this.blogService.getBlogDetail(id);
      if (!blog) {
        throw '未找到文章信息';
      }
      await this.blogService.updateSeeAccount(blog._id, blog.see + 1);
      return blog;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('create')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async createBlog(@Body() blogDto: CreateBlogDto) {
    this.myLogger.log('createBlog method');

    try {
      const blog = {
        ...blogDto,
        publishTime: Date.now(),
        updateTime: Date.now(),
        see: 0,
        like: 0,
        comments: [],
      };

      // 保证只有这俩字段
      blog.image = { name: blog.image.name, url: blog.image.url };

      const newBlog = await this.blogService.createBlog(blog);
      if (!newBlog) {
        throw '文章创建失败';
      }

      return {
        title: newBlog.title,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('delete')
  @HttpCode(200)
  async deleteBlog(@Body('id', IdValidationPipe) id: Types.ObjectId) {
    this.myLogger.log('deleteBlog method, id: ' + id);

    try {
      const blog = await this.blogService.deleteBlog(id);
      if (!blog) {
        throw '未找到文章';
      }
      return {
        title: blog.title,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('update')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async updateBlog(@Body() blogDto: UpdateBlogDto) {
    this.myLogger.log('updateBlog method');

    try {
      // 保证只有这俩字段
      blogDto.image = { name: blogDto.image.name, url: blogDto.image.url };
      const newBlog = await this.blogService.updateBlog(blogDto);
      if (!newBlog) {
        throw '未找到文章';
      }

      return {
        title: newBlog.title,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('like')
  @HttpCode(200)
  async updateLikeAccount(@Body('id', IdValidationPipe) id: Types.ObjectId, @Body('isLiked') isLiked: boolean) {
    this.myLogger.log('updateLikeAccount method');

    try {
      const blog = await this.blogService.getBlogDetail(id);
      if (!blog) {
        throw '未找到文章';
      }

      let newLikeAccount = blog.like;
      if (isLiked) {
        newLikeAccount = blog.like + 1;
      } else {
        if (newLikeAccount >= 1) {
          newLikeAccount = blog.like - 1;
        }
      }

      await this.blogService.updateLikeAccount(id, newLikeAccount);
      return {
        like: newLikeAccount,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('comment/add')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async addComment(@Body('blogId', IdValidationPipe) blogId: Types.ObjectId, @Body('comment') comment: CommentDto) {
    this.myLogger.log('addComment method');

    try {
      const blog = await this.blogService.getBlogDetail(blogId);
      if (!blog) {
        throw '未找到文章';
      }

      const comments = blog.comments;
      const random = randomBytes(16).toString('hex');
      const date = Date.now();
      const newComment: Comment = {
        id: `${date}${random}`, // 生成一个不重复的id
        ...comment,
        reply: [],
        date,
        isHide: false,
      };
      comments.unshift(newComment);

      await this.blogService.updateComments(blogId, comments);
      await this.emailService.sendCommentNotification(blog, newComment);
      return {
        comments,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('comment/reply')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async replyComment(
    @Body('blogId', IdValidationPipe) blogId: Types.ObjectId,
    @Body('parentId') parentId: string,
    @Body('replyId') replyId: string,
    @Body('comment') comment: CommentDto,
  ) {
    this.myLogger.log('replyComment method');

    try {
      // 找到博客
      const blog = await this.blogService.getBlogDetail(blogId);
      if (!blog) {
        throw '未找到文章';
      }

      // 找到博客下面的具体评论
      const totalComments = blog.comments;
      const targetComment = totalComments.find((item) => item.id === parentId);
      if (!targetComment) {
        throw '未找到父级评论';
      }

      let targetReply;
      let isReplyParent;

      // 如果父级评论的ID和replyId一致，表示对这条父级评论的回复
      if (parentId === replyId) {
        isReplyParent = true;
        targetReply = targetComment;
      } else {
        // 如果父级评论的ID和replyId不一致，表示对这条父级评论下的其他回复进行的回复
        isReplyParent = false;
        // 找到评论中的哪个回复
        targetReply = targetComment.reply.find((item) => item.id === replyId);
      }

      if (!targetReply) {
        throw '未找到回复目标';
      }

      // 构建回复对象
      const random = randomBytes(16).toString('hex');
      const date = Date.now();
      const newReply: Reply = {
        parentId,
        replyId,
        isReplyParent,
        replyArthur: targetReply.arthur,
        replyEmail: targetReply.email,
        replyContent: targetReply.content,
        id: `${date}${random}`, // 生成一个不重复的id
        ...comment,
        date,
        isHide: false,
      };

      targetComment.reply.push(newReply);

      await this.blogService.updateComments(blogId, totalComments);
      await this.emailService.sendCommentNotification(blog, newReply);
      return {
        comments: totalComments,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('comment/hide')
  @HttpCode(200)
  async hideComment(@Body('blogId', IdValidationPipe) blogId: Types.ObjectId, @Body('commentId') commentId: string) {
    this.myLogger.log('hideComment method');

    try {
      // 找到博客
      const blog = await this.blogService.getBlogDetail(blogId);
      if (!blog) {
        throw '未找到文章';
      }

      // 找到博客下面的具体评论
      const totalComments = blog.comments;
      const targetComment = this.findCommentById(totalComments, commentId);
      if (!targetComment) {
        throw '未找到评论或回复';
      }
      targetComment.isHide = true;

      await this.blogService.updateComments(blogId, totalComments);
      return {
        comment: targetComment,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('comment/delete')
  @HttpCode(200)
  async deleteComment(@Body('blogId', IdValidationPipe) blogId: Types.ObjectId, @Body('commentId') commentId: string) {
    this.myLogger.log('deleteComment method');

    try {
      // 找到博客
      const blog = await this.blogService.getBlogDetail(blogId);
      if (!blog) {
        throw '未找到文章';
      }

      // 找到博客下面的具体评论，并删除
      const totalComments = blog.comments;
      const targetComment = this.deleteCommentById(totalComments, commentId);
      if (!targetComment) {
        throw '未找到评论或回复';
      }

      await this.blogService.updateComments(blogId, totalComments);
      return {
        comment: targetComment,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // 根据id从Comments中找到对应的评论或回复
  private findCommentById = (comments: (Comment | Reply)[], id: string): Comment | Reply => {
    let result;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === id) {
        result = comments[i];
        break;
      } else if ('reply' in comments[i]) {
        result = this.findCommentById((comments[i] as Comment).reply, id);
        if (result) break;
      }
    }
    return result;
  };

  // 根据id从Comments中删除对应的评论或回复
  private deleteCommentById = (comments: (Comment | Reply)[], id: string): Comment | Reply => {
    let result;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === id) {
        result = comments.splice(i, 1);
        break;
      } else if ('reply' in comments[i]) {
        result = this.deleteCommentById((comments[i] as Comment).reply, id);
        if (result) break;
      }
    }
    return result;
  };
}
