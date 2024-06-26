import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyLoggerService } from 'src/modules/logger/logger.service';

// 拦截器也是使用 @Injectable() 装饰器的类。拦截器应该实现 NestInterceptor 接口，并且实现 intercept 方法。用来修改请求和响应。
// 可以通过 @UseInterceptors 可以将拦截器使用在局部controller上，也可以通过 app.useGlobalInterceptors 使用在全局。
@Injectable()
export class HttpInterceptor implements NestInterceptor {
  constructor(private readonly myLogger: MyLoggerService) {
    this.myLogger.setContext('HttpInterceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // next.handle() 返回一个 Observable，此流包含从路由处理程序返回的值（响应）, 我们可以使用 map() 运算符对其进行改变。
      map((data) => {
        const response = context.switchToHttp().getResponse();
        // 在这里对响应数据进行转换或操作
        const body = {
          code: 200,
          message: '调用成功',
          data,
        };
        this.myLogger.log('response data: ' + JSON.stringify(body));
        this.myLogger.log('response headers: ' + JSON.stringify(response.getHeaders()));

        // 返回转换后的body数据
        return body;
      }),
    );
  }
}
