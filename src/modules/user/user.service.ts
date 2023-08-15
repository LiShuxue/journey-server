import { Injectable } from '@nestjs/common';
import { MongodbService } from '../../mongodb/mongodb.service';
import { Collection, ObjectId } from 'mongodb';

/*
  使用 @Injectable() 注解定义一个service，他是一个provider，可以通过 constructor 注入。可以做数据检索和存储等。
*/
@Injectable()
export class UserService {
  private userCollection: Collection;

  constructor(private readonly mongodbService: MongodbService) {}

  private async ensureCollectionInitialized() {
    if (!this.userCollection) {
      this.userCollection = this.mongodbService.getCollection('User');
    }
  }

  async getUserList() {
    console.log('UserService method');
    await this.ensureCollectionInitialized();
    const query = {};
    const cursor = await this.userCollection.find(query);
    return cursor.toArray();
  }

  async getUser(id) {
    console.log('UserService method');
    await this.ensureCollectionInitialized();

    const query = { _id: new ObjectId(id) };
    const user = await this.userCollection.findOne(query);
    return user;
  }
}
