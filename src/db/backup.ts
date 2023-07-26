import qiniu from '../utils/qiniuUtil';
import logger from '../utils/logger';
import dayjs from 'dayjs';
const schedule = require('node-schedule');

const util = require('util');
const exec = util.promisify(require('node:child_process').exec);

const dbBackup = async () => {
  try {
    const dbBackupPath = '/root/mongodb/backup';
    // 更改进程的当前工作目录
    process.chdir(dbBackupPath);
    await exec(
      `docker exec journey-mongodb mongodump -h localhost:27017 -d journey -o /backup --authenticationDatabase admin -u lishuxue -p lishuxue`
    );
    // 压缩数据库备份文件
    const time = dayjs().format('YYYY-MM-DD-HH-mm-ss');
    const fileName = `DB-journey-${time}.zip`;
    await exec(`zip -r ${fileName} journey`);
    // 上传至七牛云
    const qiniuPath = 'blog/mongodb/' + fileName;
    const sourceFilePath = `${dbBackupPath}/${fileName}`;
    await qiniu.fileUpload(qiniuPath, sourceFilePath);
  } catch (err) {
    logger.error('db backup error:', err);
  }
};

const scheduleTask = () => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
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
    hour: 4
  };
  // 每天4点
  schedule.scheduleJob(options, async () => {
    dbBackup();
  });
};

export default {
  scheduleTask,
  dbBackup
};
