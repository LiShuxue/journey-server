import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// 中间件是在路由处理程序 之前 调用的函数。可以访问请求和响应对象，以及请求响应周期中的 next() 函数。可以用来处理请求、进行验证、日志记录、实现认证等操作。
// 中间件也是用 @Injectable() 声明，但是中间件不能在 @Module() 装饰器中列出。需要使用模块类的 configure() 方法来设置它们，所以包含中间件的模块必须实现 NestModule 接口，实现 configure 方法。
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`LoggerMiddleware req`);
    // console.log(req);

    // 注册一个响应对象的监听器，响应最终完成后，获取响应
    res.on('finish', () => {
      console.log(`LoggerMiddleware res`);
      // console.log(res);
    });

    // 调用下一个中间件或路由处理程序
    next();
  }
}
