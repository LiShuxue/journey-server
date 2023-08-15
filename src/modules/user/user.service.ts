import { Injectable } from '@nestjs/common';
import { MongodbService } from '../../mongodb/mongodb.service';
import { Collection } from 'mongodb';

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
    await this.ensureCollectionInitialized();
    const query = {};
    const cursor = await this.userCollection.find(query);
    return cursor.toArray();
  }
}
