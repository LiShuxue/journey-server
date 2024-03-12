import qiniu from '../utils/qiniuUtil';
import logger from '../utils/logger';
import dayjs from 'dayjs';
import schedule from 'node-schedule';
import util from 'util';
import { exec } from 'node:child_process';

const execPromise = util.promisify(exec);

const dbBackup = async () => {
  logger.info('start db backup');
  try {
    const dbBackupPath = '/root/mongodb/backup';
    // 更改进程的当前工作目录
    process.chdir(dbBackupPath);
    await execPromise(
      `docker exec journey-mongodb mongodump -h localhost:27017 -d journey -o /backup --authenticationDatabase admin -u lishuxue -p lishuxue`,
    );
    // 压缩数据库备份文件
    const now = Date.now();
    const time = dayjs(now).format('YYYY-MM-DD-HH-mm');
    const fileName = `DB-journey-${time}.zip`;
    await execPromise(`zip -r ${fileName} journey`);
    // 上传至七牛云
    const qiniuPath = 'blog/mongodb/' + fileName;
    const sourceFilePath = `${dbBackupPath}/${fileName}`;
    await qiniu.fileUpload(qiniuPath, sourceFilePath);

    logger.info('start remove old backup');
    // 每次bucket上总是保留10个。因为每周备份两次，所以相当于备份了5周的。
    // 删除旧的文件，所以是删除5周之前的那个。
    const old = now - 1000 * 60 * 60 * 24 * 7 * 5;
    const oldTime = dayjs(old).format('YYYY-MM-DD-HH-mm');
    const oldFileName = `DB-journey-${oldTime}.zip`;
    const oldQiniuPath = 'blog/mongodb/' + oldFileName;
    await qiniu.deleteFileFromQiniu(oldQiniuPath);
  } catch (err) {
    logger.error('db backup error:', err);
  }
};

const scheduleTask = () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  logger.info('start setup schedule task');
  /**
   * 参数：
   * second (0-59)
   * minute (0-59)
   * hour (0-23)
   * date (1-31)
   * month (0-11)
   * year
   * dayOfWeek (0-6) Starting with Sunday
   */
  const options = {
    second: 0,
    minute: 0,
    hour: 4, // 凌晨4点
    dayOfWeek: [3, 5], // 周三和周五
  };
  // 每周三，周五，凌晨4点执行定时任务
  schedule.scheduleJob(options, async () => {
    dbBackup();
  });
};

export default {
  scheduleTask,
  dbBackup,
};
