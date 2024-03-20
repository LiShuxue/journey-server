import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import { MyLoggerService } from 'src/logger/logger.service';
import { UserDto } from 'src/modules/user/user.dto';
import { User } from 'src/modules/user/user.schema';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.myLogger.setContext('AuthService');
  }

  async signIn(signInDto: UserDto): Promise<User> {
    this.myLogger.log('signIn method');

    const secret = this.configService.get('config.secret');
    const hashPass = createHmac('sha256', secret).update(signInDto.password).digest('hex');

    const user = await this.userService.getUserByName(signInDto.username);
    if (!user) {
      throw '用户名不存在';
    }

    if (user.password !== hashPass) {
      throw '密码错误';
    }

    return user;
  }
}
