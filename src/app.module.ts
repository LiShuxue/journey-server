import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MongodbModule } from './mongodb/mongodb.module';
import AppConfig from './config/configuration';
import MongodbConfig from './config/mongodb';

@Module({
  imports: [
    // 使用@nestjs/config做配置管理，加载不同的配置文件，作为全局模式。在别的地方通过 this.configService.get('xxx.yyy') 来获取配置
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, MongodbConfig],
    }),
    MongodbModule,
    UserModule,
  ],
})
export class AppModule {}
