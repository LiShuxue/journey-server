const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { unique: true, type: String },
    password: { type: String },
    access_token: { type: String },
    refresh_token: { type: String }
},{
    collection: 'User' // 加上这个就不会在程序中定义的是User而真实数据库中变成了Users
});

const User = mongoose.model('User', userSchema);


const createUser = (user) => {
    return User.create(user);
}

const getUser = (username) => {
    return new Promise((resolve, reject)=>{
        User.findOne({ username }, (err, doc)=>{
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    })
}

const saveAccessToken = (user, access_token) => {
    return new Promise((resolve, reject)=>{
        User.updateOne( { _id: user.id }, {
            $set: {
                access_token: access_token
            }
        }, (err, doc)=>{
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    });
}

const saveRefreshToken = (user, refresh_token) => {
    return new Promise((resolve, reject)=>{
        User.updateOne( { _id: user.id }, {
            $set: {
                refresh_token: refresh_token
            }
        }, (err, doc)=>{
            if(err){
                reject(err);
            }
            resolve(doc);
        });
    });
}

module.exports = {
    createUser,
    getUser,
    saveAccessToken,
    saveRefreshToken
};