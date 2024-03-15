import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 拦截器也是使用 @Injectable() 装饰器的类。拦截器应该实现 NestInterceptor 接口，并且实现 intercept 方法。用来修改请求和响应。
// 可以通过 @UseInterceptors 可以将拦截器使用在局部controller上，也可以通过 app.useGlobalInterceptors 使用在全局。
@Injectable()
export class HttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('HttpInterceptor before req');
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    return next.handle().pipe(
      // next.handle() 返回一个 Observable，此流包含从路由处理程序返回的值（响应）, 我们可以使用 map() 运算符对其进行改变。
      map((data) => {
        console.log('HttpInterceptor after res');
        // 在这里对响应数据进行转换或操作
        // console.log(data);
        return data; // 返回转换后的数据
      }),
    );
  }
}
