const mongoose = require('mongoose');
const db_config = require('./db_config');
const db_path = 'mongodb://' + db_config.host + ':' + db_config.port + '/' + db_config.name

mongoose.connect(db_path);
mongoose.Promise =  global.Promise;

const db = mongoose.connection;

let maxConnectTimes = 0;
db.on('error', err=>{
  console.log('DB connect failed...');
  if(maxConnectTimes < 5){
    maxConnectTimes++;
    console.log('DB connect again...');
    mongoose.connect(db_path);
  }else{
    console.log(`DB can't connect now becuase some reason...`);
  }
});
db.once('open', ()=>{
  console.log('DB connected...')
});

module.exports = db;