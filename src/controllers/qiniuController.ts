import qiniu from '../utils/qiniuUtil';
import sentry from '../utils/sentry';
import { Context } from 'koa';

const getQiniuUploadToken = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/qiniuController.js --> getQiniuUploadToken');
  const key = ctx.request.query.key; // 如：blog/image/面试/xxx.png
  let token: string = qiniu.uploadToken(key);
  ctx.status = 200;
  ctx.body = {
    successMsg: '获取七牛uploadToken成功！',
    qiniuUploadToken: token,
    uploadDomain: qiniu.uploadDomain,
    downloadDomain: qiniu.downloadDomain
  };
};

const deleteFile = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/qiniuController.js --> deleteFile');
  try {
    let filename: string = ctx.request.body.filename;
    let result = await qiniu.deleteFileFromQiniu(filename);
    ctx.status = 200;
    ctx.body = {
      successMsg: '删除文件成功!',
      result
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '删除文件失败!',
      err
    };
  }
};

export default {
  getQiniuUploadToken,
  deleteFile
};
