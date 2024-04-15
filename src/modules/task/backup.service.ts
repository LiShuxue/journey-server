import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MyLoggerService } from 'src/modules/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import dayjs from 'dayjs';
import { CommonService } from '../common/common.service';

@Injectable()
export class BackupService {
  constructor(
    private readonly myLogger: MyLoggerService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {
    this.myLogger.setContext('BackupService');
  }

  // * * * * * *
  // seconds(0-59) minutes(0-59) hours(0-23) dayOfMonth(1-31) months(0-11) dayOfWeek(0-6)

  // 测试时，每分钟的0,10,20,30,40,50秒时执行
  // @Cron('0,10,20,30,40,50 * * * * *')
  // 每周三和周五的凌晨4点
  @Cron('0 0 4 * * 3,5')
  async dbBackup() {
    this.myLogger.log('dbBackup method');
    try {
      const backupEnable = this.configService.get('db.backupEnable');
      if (!backupEnable) {
        return;
      }

      this.myLogger.log('db backup task start');
      // 备份数据库
      // docker exec journey-mongodb mongodump -h localhost:27017 -d journey -o /backup --authenticationDatabase admin -u lishuxue -p lishuxue
      const dbConfig = this.configService.get('db.admin');
      const shell = `docker exec journey-mongodb mongodump -h ${dbConfig.host}:${dbConfig.port} -d journey -o /backup --authenticationDatabase ${dbConfig.database} -u ${dbConfig.username} -p ${dbConfig.password}`;
      const execPromise = promisify(exec);
      await execPromise(shell);

      // 更改进程的当前工作目录
      const dbBackupPath = this.configService.get('db.backupPath');
      process.chdir(dbBackupPath);

      // 压缩数据库备份文件
      const now = Date.now();
      const time = dayjs(now).format('YYYY-MM-DD-HH-mm');
      const fileName = `DB-journey-${time}.zip`;
      await execPromise(`zip -r ${fileName} journey`);

      // 上传至七牛云
      const qiniuPath = 'blog/mongodb/' + fileName;
      const sourceFilePath = `${dbBackupPath}/${fileName}`;
      await this.commonService.uploadFile(qiniuPath, sourceFilePath);

      this.myLogger.log('start remove old backup');
      // 每次bucket上总是保留10个。因为每周备份两次，所以相当于备份了5周的。
      // 删除旧的文件，所以是删除5周之前的那个。
      const old = now - 1000 * 60 * 60 * 24 * 7 * 5;
      const oldTime = dayjs(old).format('YYYY-MM-DD-HH-mm');
      const oldFileName = `DB-journey-${oldTime}.zip`;
      await execPromise(`rm -rf ${oldFileName}`);
      const oldQiniuPath = 'blog/mongodb/' + oldFileName;
      await this.commonService.deleteFile(oldQiniuPath);
    } catch (err) {
      this.myLogger.error('db backup error: ' + (err?.message || err));
    }
  }
}
