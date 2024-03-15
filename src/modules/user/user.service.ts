import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';
import { User } from './user.schema';

/*
  使用 @Injectable() 注解定义一个service。他是一个provider，所以可以通过 constructor 注入。可以做数据检索和存储等。
  提供者会被声明在 @Module 的 providers 中，将被依赖注入到 Controller 或者其他地方。
*/
@Injectable()
export class UserService {
  // 在服务中通过 @InjectModel(User.name) 注入该模型，并在服务中对该模型进行操作。
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    console.log('UserService createUser method');
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async getUserList(): Promise<User[]> {
    console.log('UserService getUserList method');
    return this.userModel.find().exec();
  }

  async getUser(id: string): Promise<User> {
    console.log('UserService getUser method');
    return this.userModel.findById(id);
  }
}
