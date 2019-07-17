const qiniu = require('qiniu');

const accessKey = 'uHIW2IbsCKWoeaEW3x5tX6ajX3xL010MmmWar5vC';
const secretKey = 'BJzBW7iaoRMh370HdlWSI4gzjL9tbkn-J19uzedC';
const bucket = 'journey';
const uploadDomain = 'https://upload-z1.qiniup.com/'; 
const downloadDomain = 'http://cdn.lishuxue.site/';

// 鉴权对象
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);

// 上传凭证
const uploadToken = () => {
  let options = {
    scope: bucket, // 存储空间的Bucket名字
    expires: 2 * 60 * 60 // 上传凭证的过期时间，单位s
  };
  let putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
}

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