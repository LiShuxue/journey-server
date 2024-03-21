import { registerAs } from '@nestjs/config';

// 配置管理，值可以从.env或者.yaml文件中获取
export default registerAs('config', () => ({
  port: 4000, // 运行端口
  secret: 'journey-secret-key', // 加密密钥
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
  // 不需要鉴权就可以访问的api接口
  publicApi: ['/auth/login'],
  // 接口限流配置，1分钟最多30次请求
  throttler_ttl: 1000 * 60,
  throttler_limit: 30,
}));
