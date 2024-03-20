import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MyLoggerService } from 'src/logger/logger.service';
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
      const access_token = '';
      const refresh_token = '';
      return {
        access_token,
        refresh_token,
        username: user.username,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
