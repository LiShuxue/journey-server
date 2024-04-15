import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Ip,
  Post,
  Query,
} from '@nestjs/common';
import { MyLoggerService } from 'src/modules/logger/logger.service';
import { QiniuService } from './qiniu.service';
import { ConfigService } from '@nestjs/config';
import { TencentService } from './tencent.service';
import { load } from 'cheerio'; // 服务器上操作HTML，类似jquery
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('common')
export class CommonController {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly qiniuService: QiniuService,
    private readonly configService: ConfigService,
    private readonly tencentService: TencentService,
    private readonly httpService: HttpService,
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

  @Get('homeInfo')
  async getHomeInfo(@Ip() ip: string) {
    this.myLogger.log('getHomeInfo method, IP: ' + ip);

    try {
      const one = await this.loadWebPage();

      const locationRes = await this.tencentService.getLocationByIp(ip);
      const address = locationRes?.result?.ad_info ?? {};

      const weatherRes = await this.tencentService.getWeatherByLocation(address);
      const weather = weatherRes?.data ?? {};

      const body = {
        one,
        address,
        weather,
      };
      return body;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private loadWebPage = async () => {
    this.myLogger.log('loadWebPage method');

    const response$ = await this.httpService.get('https://wufazhuce.com/');
    const response = await firstValueFrom(response$);
    const result = this.getImageAndText(response.data);
    return result;
  };

  private getImageAndText = (htmlString: string) => {
    this.myLogger.log('getImageAndText method');

    const $ = load(htmlString);
    const todayOne = $('#carousel-one .carousel-inner .item.active');
    const imageUrl = $(todayOne).find('.fp-one-imagen').attr('src');
    const text = $(todayOne)
      .find('.fp-one-cita')
      .text()
      .replace(/(^\s*)|(\s*$)/g, '');

    return {
      imageUrl,
      text,
    };
  };
}
