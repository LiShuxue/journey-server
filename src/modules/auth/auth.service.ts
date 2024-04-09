import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import { MyLoggerService } from 'src/modules/logger/logger.service';
import { UserDto } from 'src/modules/user/user.dto';
import { User } from 'src/modules/user/user.schema';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

interface Payload {
  iss?: string;
  sub?: string;
  aud?: string;
  iat?: number;
  exp?: number;
  target?: string;
  username?: string;
}

@Injectable()
export class AuthService {
  private initPayload: Payload;
  private secret: string;

  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.myLogger.setContext('AuthService');
    this.initPayload = {
      iss: 'Journey', // (Issuer) jwt签发者
      sub: 'lishuxue.site', // (Subject) 该jwt所面向的用户
      aud: 'lishuxue.site', // (Audience) 接收jwt的一方
    };
    this.secret = this.configService.get('secret');
  }

  async signIn(signInDto: UserDto): Promise<User> {
    this.myLogger.log('signIn method');

    const password = decodeURIComponent(atob(signInDto.password));
    const hashPass = createHmac('sha256', this.secret).update(password).digest('hex');
    const user = await this.userService.getUserByName(signInDto.username);
    if (!user) {
      throw '用户名不存在';
    }

    if (user.password !== hashPass) {
      throw '密码错误';
    }

    return user;
  }

  createAccessToken(payload: Payload) {
    this.myLogger.log('createAccessToken method');
    const t_payload: Payload = Object.assign({}, this.initPayload, payload); // Object.assign(target, ...sources)
    t_payload.iat = Math.floor(Date.now() / 1000); // jwt的签发时间，单位秒s
    t_payload.exp = Math.floor(Date.now() / 1000) + 5 * 60; // jwt的过期时间，单位秒s，5分钟

    return this.jwtService.sign(t_payload);
  }

  createRefreshToken(payload: Payload) {
    this.myLogger.log('createRefreshToken method');
    const t_payload: Payload = {
      target: 'refresh',
      ...payload,
    };
    t_payload.iat = Math.floor(Date.now() / 1000);
    t_payload.exp = Math.floor(Date.now() / 1000) + 5 * 60 * 60; // 单位秒s，5个小时

    return this.jwtService.sign(t_payload);
  }

  verifyToken(accessToken, refreshToken) {
    let newToken;
    try {
      this.myLogger.log('verifyToken accessToken');
      this.jwtService.verify(accessToken);
      // 验证结果和新的token
      return [true, newToken];
    } catch (error) {
      // 过期以后，用refreshToken
      if (error.name === 'TokenExpiredError') {
        try {
          this.myLogger.log('verifyToken refreshToken');
          this.jwtService.verify(refreshToken);
        } catch (error) {
          throw 'Refresh token invalid';
        }

        newToken = this.generateNewToken(refreshToken);
        // 验证结果和新的token
        return [true, newToken];
      }

      throw 'Access token invalid';
    }
  }

  private generateNewToken(refreshToken: string) {
    this.myLogger.log('generateNewToken');
    const decoded = this.jwtService.decode(refreshToken);
    const payload = { username: decoded.username };
    const newAccessToken = this.createAccessToken(payload);
    const newRefreshToken = this.createRefreshToken(payload);
    return { newAccessToken, newRefreshToken };
  }
}
