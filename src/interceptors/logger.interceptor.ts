import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('LoggerInterceptor Before request...');
    return next.handle().pipe(
      // next.handle() 返回一个 Observable，此流包含从路由处理程序返回的值（响应）, 我们可以使用 map() 运算符地对其进行改变。
      map((data) => {
        console.log('LoggerInterceptor After response...');
        // 在这里对响应数据进行转换或操作
        return data; // 返回转换后的数据
      }),
    );
  }
}
