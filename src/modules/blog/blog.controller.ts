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
import { CreateBlogDto, UpdateBlogDto } from './blog.dto';

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
        throw '未找到文章信息';
      }
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
  async deleteBlog(@Body('id', IdValidationPipe) id: string) {
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
}
