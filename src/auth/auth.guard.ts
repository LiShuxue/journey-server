import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MyLoggerService } from 'src/logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// 守卫在中间件之后执行，或在任何拦截器或管道之前执行。一般用来做鉴权，来确定请求是否可以继续。
// 守卫也是一个使用 @Injectable() 装饰器的类。守卫必须实现一个 canActivate() 函数，此函数应该返回一个布尔值，用于指示是否允许当前请求。
// 守卫也是可以控制使用范围的，方法范围 @UseGuards() 或全局范围 app.useGlobalGuards。
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly jwtService: JwtService,
  ) {
    this.myLogger.setContext('AuthGuard');
  }

  canActivate(context: ExecutionContext): boolean {
    this.myLogger.log('AuthGuard authenticate');

    try {
      const request: Request = context.switchToHttp().getRequest();
      const { accessToken, refreshToken } = this.extractTokenFromHeader(request);
      if (!accessToken || !refreshToken) {
        throw '请求头中没有Token!';
      }

      return this.verifyToken(accessToken, refreshToken);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private extractTokenFromHeader(request: Request) {
    this.myLogger.log('extractTokenFromHeader method');
    const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];
    const refreshToken = request.headers['refresh-token'] ?? '';
    return type === 'Bearer' ? { accessToken, refreshToken } : {};
  }

  // Guard中只能用来验证token，不能用来往response header中重新设置一些token，因为这样不生效，header不会返回给客户端，需要在响应拦截器处设置响应 header
  private verifyToken(accessToken, refreshToken) {
    try {
      this.myLogger.log('verifyToken accessToken');
      this.jwtService.verify(accessToken);
      return true;
    } catch (error) {
      // 过期以后，用refreshToken
      if (error.name === 'TokenExpiredError') {
        try {
          this.myLogger.log('verifyToken refreshToken');
          this.jwtService.verify(refreshToken);
          return true;
        } catch (error) {
          throw error;
        }
      }
      throw error;
    }
  }
}
