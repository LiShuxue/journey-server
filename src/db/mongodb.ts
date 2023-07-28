import db_config from './config';
import logger from '../utils/logger';
import { MongoClient } from 'mongodb';

// 'mongodb://journey:journey@localhost:27017/journey'
const db_path: string = `mongodb://${db_config.username}:${db_config.password}@${db_config.host}:${db_config.port}/${db_config.db}`;
const client = new MongoClient(db_path);

const connectToDatabase = async () => {
  try {
    await client.connect();
    logger.info('Connected to MongoDB!');
  } catch (err) {
    logger.error('Error connecting to MongoDB:', err);
  }
};

const closeConnection = async () => {
  try {
    await client.close();
    logger.info('Connection to MongoDB closed.');
  } catch (err) {
    logger.error('Error closing MongoDB connection:', err);
  }
};

const getCollection = (collectionName: string) => {
  logger.info('getCollection: ', collectionName);
  return client.db().collection(collectionName);
};

export default {
  connectToDatabase,
  getCollection,
  closeConnection,
};
