import { Injectable } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongodbService {
  private client: MongoClient;
  private db: Db;

  constructor(private readonly configService: ConfigService) {}

  async connect() {
    const database = this.configService.get('mongodb.database');
    const username = this.configService.get('mongodb.username');
    const password = this.configService.get('mongodb.password');
    const host = this.configService.get('mongodb.host');
    const port = this.configService.get('mongodb.port');
    const url = `mongodb://${username}:${password}@${host}:${port}/${database}`;

    // 创建一个连接
    this.client = new MongoClient(url);
    try {
      // 连接到Mongodb
      await this.client.connect();
      // 连接到journey数据库
      this.db = this.client.db();
      console.log('已连接到 MongoDB');
    } catch (error) {
      console.error('连接到 MongoDB 失败：', error);
    }
  }

  async closeConnection() {
    // 关闭连接
    await this.client.close();
    console.log('MongoDB 连接已关闭');
  }

  getCollection(collectionName: string) {
    return this.db.collection(collectionName);
  }
}
