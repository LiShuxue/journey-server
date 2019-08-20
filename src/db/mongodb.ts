import db_config from './config';
const mongoose = require('mongoose');

const db_path: string = 'mongodb://' + db_config.host + ':' + db_config.port + '/' + db_config.name;
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
  mongoose.connect(db_path);
}

export default {
  dbStart
};