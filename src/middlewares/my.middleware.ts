import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyLoggerService } from 'src/modules/logger/logger.service';

// 中间件是在路由处理程序 之前 调用的函数。可以访问请求和响应对象，以及请求响应周期中的 next() 函数。可以用来处理请求、进行验证、日志记录、实现认证等操作。
// 中间件也是用 @Injectable() 声明，但是中间件不能在 @Module() 装饰器中列出。需要使用模块类的 configure() 方法来设置它们，所以包含中间件的模块必须实现 NestModule 接口，实现 configure 方法。
@Injectable()
export class MyMiddleware implements NestMiddleware {
  constructor(private readonly myLogger: MyLoggerService) {
    this.myLogger.setContext('MyMiddleware');
  }
  use(request: Request, response: Response, next: NextFunction) {
    this.myLogger.log('请求开始================================================');
    this.myLogger.log(
      '请求流动顺序：中间件 -> 守卫 —> req拦截器 -> 管道 -> 控制器 -> service -> res拦截器 -> 异常过滤器',
    );

    const data = {
      body: request.body,
      query: request.query,
      params: request.params,
    };
    this.myLogger.log('request data: ' + JSON.stringify(data));
    this.myLogger.log('request headers: ' + JSON.stringify(request.headers));
    // request中获取特定的header
    // IP地址 "::1" 是IPv6协议下的环回地址，它等同于IPv4中的 "127.0.0.1"。当你在本地机器上进行网络请求测试时，这个地址用来指向你自己的计算机。
    // IP地址是 172.18.0.2/16 或者 172.19...，172.20...，是docker bridge网络地址。
    const ips = {
      ip: request.ip,
      'x-forwarded-for': request.headers['x-forwarded-for'],
      'x-real-ip': request.headers['x-real-ip'],
    };
    this.myLogger.log('request ips: ' + JSON.stringify(ips));

    response.on('finish', () => {
      this.myLogger.log('请求结束================================================');
    });
    // 调用下一个中间件或路由处理程序
    next();
  }
}
