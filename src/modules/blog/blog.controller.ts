import { BadRequestException, Controller, Get, InternalServerErrorException, Query } from '@nestjs/common';
import { MyLoggerService } from '../logger/logger.service';
import { BlogService } from './blog.service';
import { IdValidationPipe } from 'src/pipes/idValidation.pipe';

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

  @Get('detail')
  async getBlogDetail(@Query('id', IdValidationPipe) id: string) {
    this.myLogger.log('getBlogDetail method');

    try {
      const blog = await this.blogService.getBlogDetail(id);
      if (!blog) {
        throw '未找到博客信息';
      }
      return blog;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // create update 先校验名字重复
}
