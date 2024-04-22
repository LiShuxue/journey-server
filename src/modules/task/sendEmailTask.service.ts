import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MyLoggerService } from 'src/modules/logger/logger.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { HtmlService } from '../common/html.service';
import { TencentService } from '../common/tencent.service';

@Injectable()
export class SendEamilTaskService {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly htmlService: HtmlService,
    private readonly tencentService: TencentService,
  ) {
    this.myLogger.setContext('SendEamilTaskService');
  }

  // * * * * * *
  // seconds(0-59) minutes(0-59) hours(0-23) dayOfMonth(1-31) months(0-11) dayOfWeek(0-6)

  // 测试时，每分钟的0,10,20,30,40,50秒时执行
  // @Cron('0,10,20,30,40,50 * * * * *')
  // 每天10点发送邮件
  @Cron('0 0 10 * * *')
  async sendEamilTask() {
    this.myLogger.log('sendEamilTask method');
    try {
      const sendEmailTaskEnable = this.configService.get('sendEmailTaskEnable');
      if (!sendEmailTaskEnable) {
        return;
      }

      this.myLogger.log('sendEamil task start');

      const one = await this.htmlService.loadWebPage();
      const addressList = [
        {
          email: '1149926505@qq.com',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
        },
        {
          email: '1406798534@qq.com',
          province: '天津市',
          city: '天津市',
          district: '滨海新区',
        },
      ];

      for (const address of addressList) {
        await this.sendEmail(address, one);
      }

      this.myLogger.log('sendEamil task done');
    } catch (err) {
      this.myLogger.error('sendEamil task error: ' + (err?.message || err));
    }
  }

  private sendEmail = async (address, one) => {
    this.myLogger.log('sendEmail method');

    const weather = await this.tencentService.getWeatherByLocation(address);

    const html = `
        <div class="one" style="margin: 0 auto; max-width: 720px;">
            <div class="others" style="background: #f8f8f8; color: #6d6d6d; padding: 15px 0; text-align: center;">
                <div class="city" style="margin-bottom: 5px;">${address.city} ${address.district}</div>
                <div class="wea" style="margin-bottom: 5px;">今日天气：${weather.observe.weather}</div>
                <div class="temp" style="font-size: 40px; margin: 20px 0 20px 0;">
                  ${weather.observe.degree}<span style="position: relative; top: -20px; font-size: 12px;">℃</span>
                </div>
                <div class="win">${weather.observe.wind_direction_name}： ${weather.observe.wind_power} 级</div>
            </div>
            <div class="main">
                <div class="image" style="max-width: 720px;">
                    <img src="${one.imageUrl}" style="width: 100%;" />
                </div>
                <div class="line" style="position: relative; top: -5px; height: 35px; background: #6d6d6d;"></div>
                <div class="text"
                    style="position: relative; top: -5px; padding: 0 15px; height: 120px; background: #dadada; display: flex; justify-content: center; align-items: center;">
                    <span style="color: #6d6d6d; line-height: 1.5;">${one.text}</span>
                </div>
                <div class="line" style="position: relative; top: -5px; height: 35px; background: #6d6d6d;"></div>
            </div>
        </div>
      `;

    await this.emailService.sendMail(address.email, html, '每日温暖');
  };
}
