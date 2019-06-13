const Koa = require('koa');
const app = new Koa();

const db = require('./db/mongodb');

const router = require('./src/routes');

const cors = require('koa2-cors');
app.use(cors({
  origin: function(ctx) {
    if(ctx.header.host.indexOf('localhost:4000') !== -1){
      return '*';
    }else{
      return false;
    }
  },
  maxAge: 5,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'refresh-token']
}));

// bodyparser:该中间件用于处理post请求的数据
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// app加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

// 该中间件用来提供静态文件服务
// const static = require('koa-static');
// app.use(static(__dirname + '/static', {
//   maxage: 1000 * 60 * 60 * 24 * 365
// }));

app.listen(4000, ()=>{
  console.log('server starting...')
});