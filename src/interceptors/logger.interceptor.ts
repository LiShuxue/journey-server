import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('LoggerInterceptor Before request...');
    return next.handle().pipe(
      map((data) => {
        console.log('LoggerInterceptor After response...');
        // 在这里对响应数据进行转换或操作
        return data; // 返回转换后的数据
      }),
    );
  }
}
