import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { MyLoggerService } from 'src/modules/logger/logger.service';

// 过滤器（Filters）是用于处理异常的组件，它们允许您在应用程序中统一处理抛出的异常，以提供更友好和一致的错误响应。通常是使用 @Catch() 装饰器进行注解的类。
// 它是响应返回给客户端的最后一次过滤。可以通过 @UseFilters 使用在某个controller上，也可以 app.useGlobalFilters 用在全局。
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly myLogger: MyLoggerService) {
    this.myLogger.setContext('HttpExceptionFilter');
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    // 在这里处理异常并返回响应
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const httpStatus = exception.getStatus();
    const exceptionRes: any = exception.getResponse();

    const res = {
      code: httpStatus,
      name: exception.name,
      ip: request.ip,
      path: request.url,
      message: exceptionRes?.message || exceptionRes,
    };
    this.myLogger.error('error response: ' + JSON.stringify(res));
    response.status(httpStatus).json(res);
  }
}
