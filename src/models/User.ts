import { InsertOneResult, ObjectId } from 'mongodb';
import mongodb from '../db/mongodb';

export interface IUser {
  username: string;
  password: string;
}

const User = mongodb.getCollection('User'); // 获取User表

const createUser = async (user: IUser) => {
  const result: InsertOneResult = await User.insertOne(user);
  return result;
};

const getUser = async (username: string) => {
  const query = { username };
  const user = await User.findOne(query);
  return user;
};

const getUserList = async () => {
  const query = {};
  const cursor = await User.find(query);
  return cursor.toArray();
};

const updateUser = async (id: string, user: IUser) => {
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      username: user.username,
      password: user.password,
    },
  };

  const result = await User.updateOne(filter, updateDoc);
  return result;
};

const deleteUser = async (id: string) => {
  const query = { _id: new ObjectId(id) };
  const result = await User.deleteOne(query);
  return result;
};

const deleteAllUser = (ids: string[]): Promise<any> => {
  const promiseArr = ids.map((id) => {
    return deleteUser(id);
  });
  return Promise.all(promiseArr);
};

export default {
  createUser,
  getUser,
  getUserList,
  updateUser,
  deleteAllUser,
  User,
};
