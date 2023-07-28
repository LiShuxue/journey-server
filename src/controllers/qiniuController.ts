import qiniu from '../utils/qiniuUtil';
import sentry from '../utils/sentry';
import type { Context } from 'koa';
import util from 'util';
import { exec } from 'node:child_process';

const execPromise = util.promisify(exec);

const getQiniuUploadToken = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/qiniuController.js --> getQiniuUploadToken');
  const key: string = ctx.request.query.key as string; // 如：blog/image/面试/xxx.png
  const token: string = qiniu.uploadToken(key);
  ctx.status = 200;
  ctx.body = {
    successMsg: '获取七牛uploadToken成功！',
    qiniuUploadToken: token,
    uploadDomain: qiniu.uploadDomain,
    downloadDomain: qiniu.downloadDomain,
  };
};

const deleteFile = async (ctx: Context): Promise<any> => {
  sentry.addBreadcrumb('controllers/qiniuController.js --> deleteFile');
  try {
    const filename: string = (ctx.request.body as any).filename;
    const result = await qiniu.deleteFileFromQiniu(filename);
    ctx.status = 200;
    ctx.body = {
      successMsg: '删除文件成功!',
      result,
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '删除文件失败!',
      err,
    };
  }
};

const adminUpload = async (ctx: Context) => {
  sentry.addBreadcrumb('controllers/qiniuController.js --> adminUpload');
  try {
    const project = (ctx.request.body as any).project;
    const fromPath = (ctx.request.body as any).fromPath;

    const path = `/root/project/${project}`;
    // 更改进程的当前工作目录
    process.chdir(path);
    await execPromise('git pull');
    // 上传至七牛云
    const qiniuPath = project === 'blog-article' ? `blog/image/${fromPath}` : `resume/${fromPath}`;
    const sourceFilePath = `${path}/${fromPath}`;
    await qiniu.fileUpload(qiniuPath, sourceFilePath);

    ctx.status = 200;
    ctx.body = {
      successMsg: '服务器文件上传成功!',
    };
  } catch (err) {
    sentry.captureException(err);
    ctx.status = 500;
    ctx.body = {
      errMsg: '服务器文件上传失败!',
      err,
    };
  }
};

export default {
  getQiniuUploadToken,
  deleteFile,
  adminUpload,
};
