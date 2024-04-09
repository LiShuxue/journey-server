import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

// 通过@Module 装饰器将元数据附加到模块类中， Nest 可以轻松反射（reflect）出哪些控制器（controller）必须被安装
@Module({
  // 使用 MongooseModule.forFeature 在模块中注册模型，这样，你就可以在服务中通过 @InjectModel(User.name) 注入该模型，并在服务中对该模型进行操作。
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 导出供auth模块使用
})
export class UserModule {}
