import sentry from '../utils/sentry';
import { Context } from 'koa';
import loadWebPage from '../utils/loadWebPage';

const getOneInfo = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/commonController.js --> getOneInfo');
  try {
    const result = await loadWebPage();
    ctx.status = 200;
    ctx.body = {
      result
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      err
    };
  }
};

export default {
  getOneInfo
};
