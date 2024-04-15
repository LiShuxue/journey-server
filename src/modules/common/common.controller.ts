import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Query,
} from '@nestjs/common';
import { MyLoggerService } from 'src/modules/logger/logger.service';
import { QiniuService } from './qiniu.service';
import { ConfigService } from '@nestjs/config';

@Controller('common')
export class CommonController {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly qiniuService: QiniuService,
    private readonly configService: ConfigService,
  ) {
    this.myLogger.setContext('CommonController');
  }

  @Get('uploadToken')
  getUploadToken(@Query('key') key: string) {
    this.myLogger.log('getUploadToken method');

    try {
      const token = this.qiniuService.getUploadToken(key) || '';
      const res = {
        qiniuUploadToken: token,
        uploadDomain: this.qiniuService.uploadDomain,
        downloadDomain: this.qiniuService.downloadDomain,
      };
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post('deleteFile')
  @HttpCode(200)
  async deleteFile(@Body('filename') filename: string) {
    this.myLogger.log('deleteFile method');

    try {
      const result = await this.qiniuService.deleteFile(filename);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('uploadFile')
  @HttpCode(200)
  async uploadFile(@Body('project') project: string, @Body('fromPath') fromPath: string) {
    this.myLogger.log('uploadFile method');

    try {
      const projectPath = this.configService.get('projectPath');
      const path = `${projectPath}/${project}`;

      // 上传至七牛云的路径
      const qiniuPath = project === 'blog-article' ? `blog/image/${fromPath}` : `resume/${fromPath}`;
      // 本地文件路径
      const sourceFilePath = `${path}/${fromPath}`;
      const result = await this.qiniuService.uploadFile(qiniuPath, sourceFilePath);
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
