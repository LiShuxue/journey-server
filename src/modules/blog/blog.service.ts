import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, Comment } from './blog.schema';
import { MyLoggerService } from '../logger/logger.service';
import { UpdateBlogDto } from './blog.dto';

@Injectable()
export class BlogService {
  // 在服务中通过 @InjectModel(Blog.name) 注入该模型，并在服务中对该模型进行操作。
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private readonly myLogger: MyLoggerService,
  ) {
    this.myLogger.setContext('BlogService');
  }

  getBlogList(): Promise<Blog[]> {
    this.myLogger.log('getBlogList method');

    const filter = {};
    const projection = { tags: 0, htmlContent: 0, markdownContent: 0, comments: 0 };
    return this.blogModel.find(filter, projection).sort({ publishTime: -1 });
  }

  getBlogDetail(id): Promise<Blog> {
    this.myLogger.log('getBlogDetail method, id: ' + id);

    return this.blogModel.findById(id);
  }

  createBlog(blog: Blog): Promise<Blog> {
    this.myLogger.log('createBlog method');

    // 创建对象 const xxx = new XxxModel({});
    const newBlog = new this.blogModel(blog);
    // 在 Mongoose 中，保存数据到数据库通常使用 save() 方法。
    return newBlog.save();
  }

  updateBlog(blogDto: UpdateBlogDto): Promise<Blog> {
    this.myLogger.log('updateBlog method, id: ' + blogDto._id);

    const update = {
      $set: {
        title: blogDto.title,
        subTitle: blogDto.subTitle,
        htmlContent: blogDto.htmlContent,
        markdownContent: blogDto.markdownContent,
        image: blogDto.image,
        isOriginal: blogDto.isOriginal,
        updateTime: Date.now(),
        category: blogDto.category,
        tags: blogDto.tags,
      },
    };
    // 使用 findByIdAndUpdate 方法，并设置选项 { new: true }，这样它会返回更新后的文档。如果不设置 { new: true }，则默认返回更新前的文档。
    return this.blogModel.findByIdAndUpdate(blogDto._id, update, { new: true });
  }

  updateSeeAccount = (id: string, seeCount: number): Promise<Blog> => {
    this.myLogger.log('updateSeeAccount method, id: ' + id);

    const update = {
      $set: { see: seeCount },
    };

    return this.blogModel.findByIdAndUpdate(id, update, { new: true });
  };

  updateLikeAccount = (id: string, likeCount: number): Promise<Blog> => {
    this.myLogger.log('updateLikeAccount method, id: ' + id);

    const update = {
      $set: { like: likeCount },
    };

    return this.blogModel.findByIdAndUpdate(id, update, { new: true });
  };

  updateComments = (id: string, comments: Comment[]): Promise<Blog> => {
    this.myLogger.log('updateComments method, id: ' + id);

    const update = {
      $set: { comments },
    };

    return this.blogModel.findByIdAndUpdate(id, update, { new: true });
  };

  deleteBlog(id: string): Promise<Blog> {
    this.myLogger.log('deleteBlog method, id: ' + id);

    // 使用 findByIdAndDelete 删除并返回被删除的文档
    return this.blogModel.findByIdAndDelete(id);
  }
}
