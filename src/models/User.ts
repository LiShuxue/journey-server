import { Schema, Document, Model, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
}

const userSchema: Schema = new Schema(
  {
    username: { unique: true, type: String },
    password: { type: String }
  },
  {
    collection: 'User' // 加上这个就不会在程序中定义的是User而真实数据库中变成了Users
  }
);

const User: Model<IUser, {}> = model<IUser>('User', userSchema);

const createUser = (user: IUser): Promise<IUser> => {
  return User.create(user);
};

const getUser = (username: string): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    User.findOne({ username }, (err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
};

const getUserList = (): Promise<IUser[]> => {
  return new Promise((resolve, reject) => {
    User.find({}, (err, doc) => {
      if (err) reject(err);
      resolve(doc);
    });
  });
};

const updateUser = (id: string, user: IUser): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    User.updateOne(
      {
        _id: id
      },
      {
        $set: {
          username: user.username,
          password: user.password
        }
      },
      (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      }
    );
  });
};

const deleteUser = (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    User.deleteOne(
      {
        _id: id
      },
      err => {
        if (err) reject(err);
        resolve();
      }
    );
  });
};

const deleteAllUser = (ids: string[]): Promise<any> => {
  let promiseArr = ids.map(id => {
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
  User
};
