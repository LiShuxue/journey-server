import Koa from 'koa';
import db from './db/mongodb';
import sentry from './utils/sentry';
import router from './routes';
import cors from 'koa2-cors';
import bodyParser from 'koa-bodyparser';
import { tokenMiddleware } from './middleware/tokenMiddleware';
import emailTool from './utils/email';

const app: Koa = new Koa();
db.dbStart();

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
    exposeHeaders: ['new-access-token', 'new-refresh-token']
  })
);

// bodyparser:该中间件用于处理post请求的数据
app.use(bodyParser());

// 处理token
app.use(tokenMiddleware);

// app加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err: never) => {
  sentry.captureException(err);
});

app.listen(4000, () => {
  console.log('server starting...');
});

// 定时发邮件
// emailTool.sendMailSchedule();
