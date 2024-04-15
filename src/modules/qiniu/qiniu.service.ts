import { Injectable } from '@nestjs/common';
import { MyLoggerService } from 'src/modules/logger/logger.service';
import qiniu from 'qiniu';

@Injectable()
export class QiniuService {
  private accessKey: string = 'uHIW2IbsCKWoeaEW3x5tX6ajX3xL010MmmWar5vC';
  private secretKey: string = 'BJzBW7iaoRMh370HdlWSI4gzjL9tbkn-J19uzedC';
  private bucket: string = 'journey';
  public uploadDomain: string = 'https://upload-z1.qiniup.com/';
  public downloadDomain: string = 'https://cdn.lishuxue.site/';
  private mac: qiniu.auth.digest.Mac;
  private formUploader: qiniu.form_up.FormUploader;
  private bucketManager: qiniu.rs.BucketManager;

  constructor(private readonly myLogger: MyLoggerService) {
    this.myLogger.setContext('QiniuService');

    // 一些配置，如空间zone,https,cdn等
    const config = new qiniu.conf.Config();
    // 鉴权对象mac
    this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    // 上传对象
    this.formUploader = new qiniu.form_up.FormUploader(config);
    // 资源管理对象
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, config);
  }

  // 获取上传凭证，用于上传之前获取到token
  getUploadToken(keyToOverwrite: string) {
    this.myLogger.log('getUploadToken method');
    const options = {
      scope: this.bucket + ':' + keyToOverwrite, // 存储空间的Bucket名字+需要覆盖上传的文件，这样是覆盖上传
      expires: 1 * 60, // 上传凭证的过期时间，单位s
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const token = putPolicy.uploadToken(this.mac);
    this.myLogger.log('upload token: ' + token);
    return token;
  }

  // 服务器本地文件，根据文件路径上传
  uploadFile(qiniuPath: string, sourceFilePath: string) {
    this.myLogger.log('uploadFile method');

    return new Promise((resolve, reject) => {
      this.myLogger.log(`Start upload file to Qiniuyun, qiniuPath: ${qiniuPath}, sourceFilePath: ${sourceFilePath}`);

      // 额外的上传参数
      const putExtra = new qiniu.form_up.PutExtra();
      return this.formUploader.putFile(
        this.getUploadToken(qiniuPath),
        qiniuPath,
        sourceFilePath,
        putExtra,
        (err, respBody, respInfo) => {
          if (respInfo?.statusCode === 200) {
            this.myLogger.log('Upload successful');
            return resolve(respBody);
          }

          this.myLogger.error('Upload error: ' + (err?.message || respBody?.error));
          return reject(err?.message || respBody?.error);
        },
      );
    });
  }

  // 从七牛云删除文件
  deleteFile(qiniuPath: string) {
    this.myLogger.log('deleteFile method');

    return new Promise((resolve, reject) => {
      this.myLogger.log(`Start delete file from Qiniuyun, qiniuPath: ${qiniuPath}`);

      this.bucketManager.delete(this.bucket, qiniuPath, (err: any, respBody: any, respInfo: any) => {
        if (respInfo?.statusCode === 200) {
          this.myLogger.log('Delete successful');
          return resolve(respBody);
        }

        this.myLogger.error('Delete error: ' + (err?.message || respBody?.error));
        return reject(err?.message || respBody?.error);
      });
    });
  }
}
