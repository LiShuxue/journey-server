import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './user.dto';
import { User } from './user.schema';
import { MyLoggerService } from 'src/modules/logger/logger.service';

/*
  使用 @Injectable() 注解定义一个service。他是一个provider，所以可以通过 constructor 注入。可以做数据检索和存储等。
  提供者会被声明在 @Module 的 providers 中，将被依赖注入到 Controller 或者其他地方。
*/
@Injectable()
export class UserService {
  // 在服务中通过 @InjectModel(User.name) 注入该模型，并在服务中对该模型进行操作。
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly myLogger: MyLoggerService,
  ) {
    this.myLogger.setContext('UserService');
  }

  getUserList(): Promise<User[]> {
    this.myLogger.log('getUserList method');

    return this.userModel.find();
  }

  getUserByName(username: string): Promise<User> {
    this.myLogger.log('getUserByName method, username: ' + username);

    const filter = { username };
    return this.userModel.findOne(filter);
  }

  createUser(userDto: UserDto): Promise<User> {
    this.myLogger.log('createUser method');

    // 创建对象 const xxx = new XxxModel({});
    const user = new this.userModel(userDto);
    // 在 Mongoose 中，保存数据到数据库通常使用 save() 方法。
    return user.save();
  }

  updateUser(userDto: UserDto): Promise<User> {
    this.myLogger.log('updateUser method');

    const filter = { username: userDto.username };
    const update = {
      $set: {
        username: userDto.username,
        password: userDto.password,
      },
    };
    // 使用 findOneAndUpdate 方法，并设置选项 { new: true }，这样它会返回更新后的文档。如果不设置 { new: true }，则默认返回更新前的文档。
    return this.userModel.findOneAndUpdate(filter, update, { new: true });
  }

  deleteUser(id: string): Promise<User> {
    this.myLogger.log('deleteUser method, id: ' + id);

    // 使用 findByIdAndDelete 删除并返回被删除的文档
    return this.userModel.findByIdAndDelete(id);
  }
}
