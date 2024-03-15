import { registerAs } from '@nestjs/config';

// 配置管理，值可以从.env或者.yaml文件中获取
export default registerAs('config', () => ({
  port: 4000,
  db: {
    // journey db，业务DB
    journey: {
      host: 'localhost',
      port: '27017',
      username: 'journey',
      password: 'journey',
      database: 'journey',
    },
    // admin db，数据库管理员DB
    admin: {
      host: 'localhost',
      port: '27017',
      username: 'lishuxue',
      password: 'lishuxue',
      database: 'admin',
    },
  },
}));
