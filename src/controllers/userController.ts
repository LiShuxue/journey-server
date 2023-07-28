import UserModel, { IUser } from '../models/User';
import crypto from 'crypto';
import { createAccessToken, createRefreshToken } from '../middleware/tokenMiddleware';
import sentry from '../utils/sentry';
import type { Context } from 'koa';

const secret = 'secret-key';

const login = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/userController.js --> login');

  try {
    const username: string = (ctx.request.body as any).username;
    const hashPass: string = crypto.createHmac('sha256', secret).update((ctx.request.body as any).password).digest('hex');

    const doc = await UserModel.getUser(username);

    if (!doc) {
      ctx.status = 200;
      ctx.body = {
        errMsg: '用户名不存在!',
      };
      return;
    }

    if (doc.password !== hashPass) {
      ctx.status = 200;
      ctx.body = {
        errMsg: '密码错误!',
      };
      return;
    }

    const access_token: string = createAccessToken({ username });
    const refresh_token: string = createRefreshToken();
    ctx.status = 200;
    ctx.body = {
      successMsg: '登录成功!',
      username,
      access_token,
      refresh_token,
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '数据库查找用户名出错!',
      err,
    };
  }
};

const register = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/userController.js --> register');
  try {
    const username: string = (ctx.request.body as any).username;
    const hashPass: string = crypto.createHmac('sha256', secret).update((ctx.request.body as any).password).digest('hex');

    const user: IUser = {
      username: username,
      password: hashPass,
    };
    await UserModel.createUser(user);
    ctx.status = 200;
    ctx.body = {
      successMsg: '注册成功!',
    };
  } catch (err: any) {
    if (err.code === 11000) {
      ctx.status = 200;
      ctx.body = {
        errMsg: '用户名已存在!',
        err,
      };
      return;
    }
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '注册失败!',
      err,
    };
  }
};

const userList = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/userController.js --> userList');
  try {
    const userList = await UserModel.getUserList();
    ctx.status = 200;
    ctx.body = {
      successMsg: '获取用户列表成功!',
      userList,
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '获取用户列表失败!',
      err,
    };
  }
};
const deleteUser = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/userController.js --> deleteUser');
  try {
    const ids: string[] = (ctx.request.body as any).ids;
    await UserModel.deleteAllUser(ids);

    ctx.status = 200;
    ctx.body = {
      successMsg: '删除用户成功!',
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '删除用户失败!',
      err,
    };
  }
};
const updateUser = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/userController.js --> updateUser');
  try {
    const user: any = ctx.request.body;
    user.password = crypto.createHmac('sha256', secret).update((ctx.request.body as any).password).digest('hex');
    await UserModel.updateUser(user._id, user);
    ctx.status = 200;
    ctx.body = {
      successMsg: '更新用户成功!',
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '更新用户失败!',
      err,
    };
  }
};

export default {
  login,
  register,
  userList,
  deleteUser,
  updateUser,
};
