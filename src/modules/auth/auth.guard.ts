import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MyLoggerService } from 'src/modules/logger/logger.service';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

// 守卫在中间件之后执行，或在任何拦截器或管道之前执行。一般用来做鉴权，来确定请求是否可以继续。
// 守卫也是一个使用 @Injectable() 装饰器的类。守卫必须实现一个 canActivate() 函数，此函数应该返回一个布尔值，用于指示是否允许当前请求。
// 守卫也是可以控制使用范围的，方法范围 @UseGuards() 或全局范围 app.useGlobalGuards。
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.myLogger.setContext('AuthGuard');
  }

  canActivate(context: ExecutionContext): boolean {
    this.myLogger.log('AuthGuard authenticating');

    try {
      const request = context.switchToHttp().getRequest();

      // 对于不需要鉴权的接口，直接返回true
      const publicApi = this.configService.get('publicApi') || [];
      if (publicApi.includes(request.url)) {
        return true;
      }

      // 获取token
      const { accessToken, refreshToken } = this.extractTokenFromHeader(request);
      if (!accessToken) {
        throw '请求头中没有accessToken';
      }
      if (!refreshToken) {
        throw '请求头中没有refreshToken';
      }

      // 验证token
      const [result, newToken] = this.authService.verifyToken(accessToken, refreshToken);
      if (newToken) {
        const { newAccessToken, newRefreshToken } = newToken;
        // 通过response。setHeader()，将response header中设置新的token
        context.switchToHttp().getResponse().setHeader('new-access-token', newAccessToken);
        context.switchToHttp().getResponse().setHeader('new-refresh-token', newRefreshToken);
      }

      return result;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  // 从request中获取token
  private extractTokenFromHeader(request) {
    const [type, accessToken] = request.headers.authorization?.split(' ') ?? [];
    const refreshToken = request.headers['refresh-token'] ?? '';
    return type === 'Bearer' ? { accessToken, refreshToken } : {};
  }
}
