import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MyLoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class TencentService {
  // 腾讯位置服务，IP定位：https://lbs.qq.com/service/webService/webServiceGuide/position/webServiceIp
  private locationUrl: string = 'https://apis.map.qq.com/ws/location/v1/ip';
  // 腾讯位置服务，开发者密钥：https://lbs.qq.com/dev/console/application/mine
  private secretkey: string = 'GWSBZ-HTTWJ-QJIF2-KLHLC-X3WKV-ZZFV6';
  // 腾讯天气接口
  private weatherUrl: string = 'https://wis.qq.com/weather/common?source=pc&weather_type=observe|tips';

  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly httpService: HttpService,
  ) {
    this.myLogger.setContext('TencentService');
  }

  async getLocationByIp(ip = '') {
    this.myLogger.log('getLocationByIp method');

    const url = `${this.locationUrl}?ip=${ip}&key=${this.secretkey}`;
    // 返回的是Observable对象，不是Promise
    const response$ = this.httpService.get(url);
    // 将Observable对象转为Promise
    const response = await firstValueFrom(response$);
    return response.data;
  }

  async getWeatherByLocation(location: any = {}) {
    this.myLogger.log('getWeatherByLocation method');

    const url = `${this.weatherUrl}&province=${location.province}&city=${location.city}&county=${location.district}`;
    const response$ = this.httpService.get(url);
    const response = await firstValueFrom(response$);
    return response.data;
  }
}
