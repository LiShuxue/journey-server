import db_config from './config';
const mongoose = require('mongoose');

// 'mongodb://journey:journey@localhost:27017/journey'
const db_path: string = `mongodb://${db_config.username}:${db_config.password}@${db_config.host}:${db_config.port}/${db_config.db}`
const db = mongoose.connection;

let maxConnectTimes: number = 0;
db.on('error', ()=>{
  console.log('DB connect failed...');
  if(maxConnectTimes < 5){
    setTimeout(()=>{
      maxConnectTimes++;
      console.log('DB connect again...');
      dbStart();
    }, 2000);
  }else{
    console.log(`DB can't connect now becuase some reason...`);
  }
});
db.once('open', ()=>{
  console.log('DB connected...');
});

const dbStart = function(): void {
  mongoose.set('useCreateIndex', true);
  mongoose.connect(db_path);
}

export default {
  dbStart
};