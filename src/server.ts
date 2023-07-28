import Koa from 'koa';
import mongodb from './db/mongodb';
import backup from './db/backup';
import sentry from './utils/sentry';
import router from './routes';
import cors from 'koa2-cors';
import bodyParser from 'koa-bodyparser';
import { tokenMiddleware } from './middleware/tokenMiddleware';
import logger from './utils/logger';

const app: Koa = new Koa();
app.proxy = true;

// 连接到数据库
mongodb.connectToDatabase();
// 每天备份数据库数据
backup.scheduleTask();

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
