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
}
