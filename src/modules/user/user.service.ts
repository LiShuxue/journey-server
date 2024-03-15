import { Injectable } from '@nestjs/common';

/*
  使用 @Injectable() 注解定义一个service。他是一个provider，所以可以通过 constructor 注入。可以做数据检索和存储等。
  提供者会被声明在 @Module 的 providers 中，将被依赖注入到 Controller 或者其他地方。
*/
@Injectable()
export class UserService {
  async getUserList() {
    console.log('UserService getUserList method');
    return [];
  }

  async getUser(id: string) {
    console.log('UserService getUser method');
    console.log(id);
    return {};
  }
}
