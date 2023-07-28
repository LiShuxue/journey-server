import type { Logger } from 'log4js';
import log4js from 'log4js';
import fs from 'fs';
import path from 'path';

const logPath = path.resolve(__dirname, '../../logs/journey-server');

const logsDir = path.parse(logPath).dir;
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

log4js.configure({
  pm2: true,
  pm2InstanceVar: 'INSTANCE_ID',
  // 配置打印输出源
  appenders: {
    dateFile: {
      type: 'dateFile', // 日志打印在文件中
      filename: logPath, // 文件名
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
    console: {
      type: 'console', // 日志打印在控制台
    },
  },

  // logger分类，如log4js.getLogger('dev')
  // log级别从低到高：ALL < MARK < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < OFF
  // 定义了日志级别以后，只有这个级别或者这个级别以上的日志会被打印
  categories: {
    dev: {
      appenders: ['console'],
      level: 'trace',
    },
    prd: {
      appenders: ['dateFile'],
      level: 'trace',
    },
    default: {
      // 必须配置，不然报错
      appenders: ['console'],
      level: 'all',
    },
  },
});

let logger: Logger;

if (process.env.NODE_ENV === 'production') {
  logger = log4js.getLogger('prd');
} else {
  logger = log4js.getLogger('dev');
}

export default logger;
