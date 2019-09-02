interface DBConfig {
  name: string,
  host: string,
  port: number
};

const db_config: DBConfig = { 
  name: 'journey', 
  host: 'localhost',
  port: 27017
};

export default db_config