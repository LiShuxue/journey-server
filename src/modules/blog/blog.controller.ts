import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { MyLoggerService } from '../logger/logger.service';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly blogService: BlogService,
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
}
