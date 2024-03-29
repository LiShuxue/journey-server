import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { handleNotNeedTokenUrl } from '../routes/notNeedTokenUrl';

interface Payload {
  iss?: string;
  sub?: string;
  aud?: string;
  iat?: number;
  exp?: number;
  target?: string;
  username?: string;
}

const secret: string = 'secret-key';

const initPayload: Payload = {
  iss: 'Journey', //(Issuer) jwt签发者
  sub: 'lishuxue.site', //(Subject) 该jwt所面向的用户
  aud: 'lishuxue.site', //(Audience) 接收jwt的一方
};

export function createAccessToken(payload: Payload): string {
  const t_payload: Payload = Object.assign({}, initPayload, payload); //Object.assign(target, ...sources)
  t_payload.iat = Math.floor(Date.now() / 1000); // jwt的签发时间，单位秒s
  t_payload.exp = Math.floor(Date.now() / 1000) + 5 * 60; // jwt的过期时间，单位秒s
  const token: string = jwt.sign(t_payload, secret);
  return token;
}

export function createRefreshToken(): string {
  const t_payload: Payload = {
    target: 'refresh',
  };
  t_payload.iat = Math.floor(Date.now() / 1000);
  t_payload.exp = Math.floor(Date.now() / 1000) + 5 * 60 * 60;
  const token: string = jwt.sign(t_payload, secret);
  return token;
}

const verifyAccessToken = async (ctx: Context): Promise<any> => {
  const authorization: string = ctx.get('Authorization');
  const access_token: string = authorization.split(' ')[1];
  const refresh_token: string = ctx.get('refresh-token'); // nginx代理请求不支持header中包含下划线

  if (access_token === '' || refresh_token === '') {
    throw { errMsg: '请求头中没有Token!' };
  }

  try {
    jwt.verify(access_token, secret);
  } catch (err: any) {
    await handleAccessTokenError(err, ctx, access_token, refresh_token);
  }
};

const handleAccessTokenError = async (
  err: jwt.JsonWebTokenError,
  ctx: Context,
  access_token: string,
  refresh_token: string,
): Promise<any> => {
  if (err.name !== 'TokenExpiredError') {
    throw { errMsg: 'Access_Token验证失败!' };
  }

  // token过期自动刷新token
  // 1.先验证refresh_token
  // 2.生成新的token
  try {
    await verifyRefreshToken(refresh_token);
  } catch (err) {
    throw { errMsg: 'Refresh_Token验证失败!' };
  }

  try {
    ctx.token = await autoGenerateNewToken(access_token);
  } catch (err) {
    throw { errMsg: '生成新的token失败!' };
  }
};

const verifyRefreshToken = (refresh_token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(refresh_token, secret);
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

const autoGenerateNewToken = (access_token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const decoded: any = jwt.decode(access_token);
      const username: string = decoded.username;
      const new_access_token: string = createAccessToken({ username });
      const new_refresh_token: string = createRefreshToken();
      resolve({
        new_access_token,
        new_refresh_token,
      });
    } catch (err) {
      reject(err);
    }
  });
};

const returnNewToken = (ctx: Context): void => {
  if (ctx.token && ctx.token.new_access_token && ctx.token.new_refresh_token) {
    ctx.set('new-access-token', ctx.token.new_access_token);
    ctx.set('new-refresh-token', ctx.token.new_refresh_token);
  }
};

export async function tokenMiddleware(ctx: Context, next: any): Promise<any> {
  if (handleNotNeedTokenUrl(ctx)) {
    await next();
  } else {
    try {
      await verifyAccessToken(ctx);
      returnNewToken(ctx);
      await next();
    } catch (err: any) {
      ctx.status = 401;
      ctx.body = {
        errMsg: err.errMsg,
      };
    }
  }
}
