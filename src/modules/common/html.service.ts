import { Injectable } from '@nestjs/common';
import { MyLoggerService } from 'src/modules/logger/logger.service';
import { load } from 'cheerio'; // 服务器上操作HTML，类似jquery
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HtmlService {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly httpService: HttpService,
  ) {
    this.myLogger.setContext('HtmlService');
  }

  loadWebPage = async () => {
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
