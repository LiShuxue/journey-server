import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { LoggerModule } from 'src/modules/logger/logger.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true, // 将 global 设置为 true 可以使得 JwtService 在整个应用程序中都可用
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('config.secret'), // 在注册 JwtModule 时指定了 secret，在以后的使用中并不需要每次都再次指定该参数
      }),
    }),
    UserModule,
    LoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
