import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './blog.schema';
import { MyLoggerService } from '../logger/logger.service';

@Injectable()
export class BlogService {
  // 在服务中通过 @InjectModel(Blog.name) 注入该模型，并在服务中对该模型进行操作。
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private readonly myLogger: MyLoggerService,
  ) {
    this.myLogger.setContext('BlogService');
  }

  async getBlogList(): Promise<Blog[]> {
    this.myLogger.log('getBlogList method');

    return this.blogModel
      .find({}, { tags: 0, htmlContent: 0, markdownContent: 0, comments: 0 })
      .sort({ publishTime: -1 })
      .exec();
  }
}
