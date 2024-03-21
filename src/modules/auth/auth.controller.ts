import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MyLoggerService } from 'src/modules/logger/logger.service';
import { UserDto } from 'src/modules/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly authService: AuthService,
  ) {
    this.myLogger.setContext('AuthController');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  async signIn(@Body() signInDto: UserDto) {
    this.myLogger.log('signIn method');

    try {
      const user = await this.authService.signIn(signInDto);
      const payload = { username: user.username };
      const access_token = this.authService.createAccessToken(payload);
      const refresh_token = this.authService.createRefreshToken(payload);
      return {
        access_token,
        refresh_token,
        username: user.username,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
