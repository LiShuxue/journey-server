import Koa from 'koa';
import mongodb from './db/mongodb';
import backup from './db/backup';
import sentry from './utils/sentry';
import router from './routes';
import cors from 'koa2-cors';
import bodyParser from 'koa-bodyparser';
import { tokenMiddleware } from './middleware/tokenMiddleware';
import logger from './utils/logger';
import ratelimit from 'koa2-ratelimit';

const app: Koa = new Koa();
app.proxy = true; // 告诉 Koa 应用，它运行在nginx代理之后，应该信任代理的头信息，例如 X-Forwarded-For。这对于获取客户端真实 IP 地址是很有用的。

// 连接到数据库
mongodb.connectToDatabase();
// 每天备份数据库数据
backup.scheduleTask();

// 处理cors中间件
app.use(
  cors({
    origin: () => {
      if (process.env.NODE_ENV !== 'production') {
        return '*';
      } else {
        return 'https://lishuxue.site';
      }
    },
    maxAge: 5,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'refresh-token'],
    exposeHeaders: ['new-access-token', 'new-refresh-token'],
  }),
);

// 处理限流，每个IP最多1分钟60个请求
app.use(
  ratelimit.RateLimit.middleware({
    interval: 1 * 60 * 1000, // 1分钟
    max: 60,
    message: '请求过于频繁，请稍后重试。',
  }),
);

// bodyparser:该中间件用于处理post请求的数据
app.use(bodyParser());

// 处理token
app.use(tokenMiddleware);

// app加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err: any) => {
  sentry.captureException(err);
});

app.listen(4000, () => {
  logger.info('server starting...');
});

// 应用程序结束时关闭连接
process.on('SIGINT', async () => {
  await mongodb.closeConnection();
  process.exit(0);
});
