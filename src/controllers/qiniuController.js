const qiniu = require('../utils/qiniuUtil');

const getQiniuUploadToken = async (ctx, next) => {
  let token = qiniu.uploadToken();
  ctx.status = 200;
  ctx.body = {
    successMsg: '获取七牛uploadToken成功！',
    qiniuUploadToken: token,
    uploadDomain: qiniu.uploadDomain,
    downloadDomain: qiniu.downloadDomain
  }
  await next();
}

const deleteFile = async (ctx, next) => {
  let filename = ctx.request.body.filename;
  try {
    let result = await qiniu.deleteFileFromQiniu(filename);
    ctx.status = 200;
    ctx.body = { 
        successMsg: '删除文件成功!',
        result
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
        errMsg: '删除文件失败!',
        err
    }
  }
  await next();
}

module.exports = {
  getQiniuUploadToken,
  deleteFile
}