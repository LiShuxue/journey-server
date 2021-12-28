import sentry from '../utils/sentry';
import { Context } from 'koa';
import loadWebPage from '../utils/loadWebPage';
import axios from 'axios';
import logger from '../utils/logger';

const getHomeInfo = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/commonController.js --> getHomeInfo');
  logger.info('getHomeInfo');
  try {
    const ip = ctx.request.ip;
    logger.info('ip: ' + ip);
    const one = await loadWebPage();
    // 腾讯位置服务，根据IP获取城市信息 https://lbs.qq.com/service/webService/webServiceGuide/webServiceIp
    const positionUrl = `https://apis.map.qq.com/ws/location/v1/ip?ip=${ip}&key=GWSBZ-HTTWJ-QJIF2-KLHLC-X3WKV-ZZFV6`;
    const addressInfo = await axios.get(encodeURI(positionUrl));
    const province = addressInfo.data && addressInfo.data.result ? addressInfo.data.result.ad_info.province : '';
    const city = addressInfo.data && addressInfo.data.result ? addressInfo.data.result.ad_info.city : '';
    const district = addressInfo.data && addressInfo.data.result ? addressInfo.data.result.ad_info.district : '';
    // 腾讯天气服务，根据城市获取天气预报信息
    const url = `https://wis.qq.com/weather/common?source=pc&weather_type=observe|tips&province=${province}&city=${city}&county=${district}`;
    const wea = await axios.get(encodeURI(url));
    ctx.status = 200;
    ctx.body = {
      one,
      address: addressInfo.data && addressInfo.data.result ? addressInfo.data.result.ad_info : {},
      wea: wea.data ? wea.data.data : {}
    };
  } catch (err) {
    logger.error(err);
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
