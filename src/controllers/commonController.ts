import sentry from '../utils/sentry';
import { Context } from 'koa';
import loadWebPage from '../utils/loadWebPage';
import axios from 'axios';

const getHomeInfo = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/commonController.js --> getHomeInfo');
  try {
    const ip = ctx.request.ip;
    const one = await loadWebPage();
    // 腾讯位置服务，根据IP获取城市信息
    const positionUrl = `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=GWSBZ-HTTWJ-QJIF2-KLHLC-X3WKV-ZZFV6`;
    const cityinfo = await axios.get(encodeURI(positionUrl));
    const city = cityinfo.data.result ? cityinfo.data.result.ad_info.city.replace('市', '') : '北京';
    // 根据城市获取天气预报信息
    const url = `https://www.tianqiapi.com/free/day?appid=19838913&appsecret=dUknzCP2&city=${city}`;
    const wea = await axios.get(encodeURI(url));
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
