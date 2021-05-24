import sentry from '../utils/sentry';
import { Context } from 'koa';
import loadWebPage from '../utils/loadWebPage';
import axios from 'axios';

const getHomeInfo = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/commonController.js --> getHomeInfo');
  try {
    const one = await loadWebPage();
    const wea = await axios.get('https://www.tianqiapi.com/free/day?appid=19838913&appsecret=dUknzCP2');
    ctx.status = 200;
    ctx.body = {
      one,
      wea: wea.data
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
  getHomeInfo
};
