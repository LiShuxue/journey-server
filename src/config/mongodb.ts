import { registerAs } from '@nestjs/config';

// 配置管理，值可以从.env或者.yaml文件中获取
export default registerAs('mongodb', () => ({
  host: 'localhost',
  port: '27017',
  username: 'journey', // admin db: lishuxue/lishuxue
  password: 'journey',
  database: 'journey',
}));
