import { Injectable } from '@nestjs/common';
import { MyLoggerService } from 'src/modules/logger/logger.service';
import qiniu from 'qiniu';

@Injectable()
export class QiniuService {
  private accessKey: string = 'uHIW2IbsCKWoeaEW3x5tX6ajX3xL010MmmWar5vC';
  private secretKey: string = 'BJzBW7iaoRMh370HdlWSI4gzjL9tbkn-J19uzedC';
  private bucket: string = 'journey';

  constructor(private readonly myLogger: MyLoggerService) {
    this.myLogger.setContext('QiniuService');
  }

  // 获取上传凭证，用于上传之前获取到token
  getUploadToken(keyToOverwrite: string) {
    const options = {
      scope: this.bucket + ':' + keyToOverwrite, // 存储空间的Bucket名字+需要覆盖上传的文件，这样是覆盖上传
      expires: 1 * 60, // 上传凭证的过期时间，单位s
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    // 鉴权对象mac
    const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    const token = putPolicy.uploadToken(mac);
    this.myLogger.log('getUploadToken: ' + token);
    return token;
  }

  // 服务器本地文件上传
  localFileUpload(qiniuPath: string, sourceFilePath: string) {
    this.myLogger.log(`Start upload file to Qiniuyun, qiniuPath: ${qiniuPath}, sourceFilePath: ${sourceFilePath}`);

    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    return new Promise((resolve, reject) => {
      formUploader.putFile(
        this.getUploadToken(qiniuPath),
        qiniuPath,
        sourceFilePath,
        putExtra,
        (err, respBody, respInfo) => {
          if (err) {
            this.myLogger.error('Upload error: ' + err.message);
            reject(err);
          } else {
            this.myLogger.log('Upload successful');
            resolve({
              respBody,
              respInfo,
            });
          }
        },
      );
    });
  }

  // 从七牛云删除文件
  deleteFileFromQiniu(qiniuPath: string) {
    this.myLogger.log(`Start delete file from Qiniuyun, qiniuPath: ${qiniuPath}`);
    const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    const config = new qiniu.conf.Config();
    const bucketManager = new qiniu.rs.BucketManager(mac, config);

    return new Promise((resolve, reject) => {
      bucketManager.delete(this.bucket, qiniuPath, (err: any, respBody: any, respInfo: any) => {
        if (err) {
          this.myLogger.error('Delete error: ' + err.message);
          reject(err);
        } else {
          this.myLogger.log('Delete successful');
          resolve({
            respInfo,
            respBody,
          });
        }
      });
    });
  }
}
