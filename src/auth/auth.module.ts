import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [UserModule, LoggerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
