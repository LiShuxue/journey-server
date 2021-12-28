import db_config from './config';
import logger from '../utils/logger';
const mongoose = require('mongoose');

// 'mongodb://journey:journey@localhost:27017/journey'
const db_path: string = `mongodb://${db_config.username}:${db_config.password}@${db_config.host}:${db_config.port}/${db_config.db}`;
const db = mongoose.connection;

let maxConnectTimes: number = 0;
db.on('error', () => {
  logger.info('DB connect failed...');
  if (maxConnectTimes < 5) {
    setTimeout(() => {
      maxConnectTimes++;
      logger.info('DB connect again...');
      dbStart();
    }, 2000);
  } else {
    logger.info(`DB can't connect now becuase some reason...`);
  }
});
db.once('open', () => {
  logger.info('DB connected...');
});

const dbStart = function(): void {
  mongoose.set('useCreateIndex', true);
  mongoose.connect(db_path);
};

export default {
  dbStart
};
