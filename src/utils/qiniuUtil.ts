import qiniu from 'qiniu';
import logger from './logger';

const accessKey: string = 'uHIW2IbsCKWoeaEW3x5tX6ajX3xL010MmmWar5vC';
const secretKey: string = 'BJzBW7iaoRMh370HdlWSI4gzjL9tbkn-J19uzedC';
const bucket: string = 'journey';
const uploadDomain: string = 'https://upload-z1.qiniup.com/';
const downloadDomain: string = 'https://cdn.lishuxue.site/';

// 鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);

// 上传凭证
const uploadToken = (keyToOverwrite: string) => {
  const options = {
    scope: bucket + ':' + keyToOverwrite, // 存储空间的Bucket名字+需要覆盖上传的文件
    expires: 1 * 60, // 上传凭证的过期时间，单位s
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
};

// 从七牛云删除文件
const deleteFileFromQiniu = function (qiniuPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    bucketManager.delete(bucket, qiniuPath, (err: any, respBody: any, respInfo: any) => {
      if (err) {
        reject(err);
      }
      resolve({
        respInfo,
        respBody,
      });
    });
  });
};

// 文件上传
const fileUpload = (qiniuPath: string, sourceFilePath: string) => {
  logger.info(`Start upload file to Qiniuyun, qiniuPath: ${qiniuPath}, sourceFilePath: ${sourceFilePath}`);

  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();

  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken(qiniuPath), qiniuPath, sourceFilePath, putExtra, (respErr, respBody, respInfo) => {
      if (respErr) {
        logger.error('Upload error: ', respErr);
        reject(respErr);
      } else {
        logger.info('Upload successful');
        resolve({
          respBody,
          respInfo,
        });
      }
    });
  });
};

export default {
  uploadToken,
  deleteFileFromQiniu,
  uploadDomain,
  downloadDomain,
  fileUpload,
};
