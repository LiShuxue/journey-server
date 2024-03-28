interface DBConfig {
  db: string;
  host: string;
  port: number;
  username: string;
  password: string;
  admin?: DBConfig;
}

const db_config: DBConfig = {
  db: 'journey',
  host: process.env.NODE_ENV === 'production' ? 'journey-mongodb' : 'localhost',
  port: 27017,
  username: 'journey', // admin db: lishuxue/lishuxue
  password: 'journey',
  admin: {
    db: 'admin',
    host: process.env.NODE_ENV === 'production' ? 'journey-mongodb' : 'localhost',
    port: 27017,
    username: 'lishuxue',
    password: 'lishuxue',
  },
};

export default db_config;
