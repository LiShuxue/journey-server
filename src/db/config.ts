interface DBConfig {
  db: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

const db_config: DBConfig = {
  db: 'journey',
  host: 'localhost',
  port: 27017,
  username: 'journey',
  password: 'journey'
};

export default db_config;
