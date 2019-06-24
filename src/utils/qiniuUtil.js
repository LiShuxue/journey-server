const qiniu = require('qiniu');

const accessKey = 'uHIW2IbsCKWoeaEW3x5tX6ajX3xL010MmmWar5vC';
const secretKey = 'BJzBW7iaoRMh370HdlWSI4gzjL9tbkn-J19uzedC';
const bucket = 'journey';
const uploadDomain = 'https://upload-z1.qiniup.com/'; 
const downloadDomain = 'http://cdn.lishuxue.site/';

// 鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const options = {
  scope: bucket, // 存储空间的Bucket名字
  expires: 2 * 60 * 60 // 上传凭证的过期时间，单位s
};
const putPolicy = new qiniu.rs.PutPolicy(options);
// 上传凭证
const uploadToken = putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);
// 从七牛云删除文件
const deleteFileFromQiniu = (key) => {
  return new Promise((resolve, reject) => {
    bucketManager.delete(bucket, key, (err, respBody, respInfo) => {
      if (err) {
        reject(err);
      } 
      resolve({
        respInfo,
        respBody
      })
    });
  });
}

module.exports = {
  uploadToken,
  deleteFileFromQiniu,
  uploadDomain,
  downloadDomain
}