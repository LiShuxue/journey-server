const UserModel = require('../models/User');
const crypto = require('crypto');
const secret = 'secret-key';
const tokenUtil = require('../utils/tokenUtil');

const login = async ( ctx ) => {
    let username = ctx.request.body.username;
    let hashPass = crypto.createHmac('sha256', secret)
        .update(ctx.request.body.password)
        .digest('hex');

    try{
        let doc = await UserModel.getUser(username);

        if(!doc) {
            ctx.status = 200;
            ctx.body = {
                errMsg: '用户名不存在!'
            }
            return;
        }
    
        if(doc.password !== hashPass) {
            ctx.status = 200;
            ctx.body = {
                errMsg: '密码错误!'
            }
            return;
        }

        let access_token = tokenUtil.createAccessToken({username});
        let refresh_token = tokenUtil.createRefreshToken();
        ctx.status = 200;
        ctx.body = { 
            successMsg: '登录成功!',
            username,
            access_token,
            refresh_token
        };
    } catch (err) {
        ctx.status = 500;
        ctx.body = {
            errMsg: '数据库查找用户名出错!',
            err
        }
    }
}

const register = async ( ctx ) => {
    let username = ctx.request.body.username;
    let hashPass = crypto.createHmac('sha256', secret)
        .update(ctx.request.body.password)
        .digest('hex');

    let user = {
        username: username,
        password: hashPass
    };

    try {
        let result = await UserModel.createUser(user);
        ctx.status = 200;
        ctx.body = {
            successMsg: '注册成功!',
            username: result.username
        }
    } catch (err) {
        if(err.code === 11000) {
            ctx.status = 200;
            ctx.body = {
                errMsg: '用户名已存在!',
                err
            }
            return;
        }
        ctx.status = 500;
        ctx.body = {
            errMsg: '注册失败!',
            err
        }
    }
}

const userList = async (ctx, next) => {
    try {
        let userList = await UserModel.getUserList();
        ctx.status = 200;
        ctx.body = {
            successMsg: '获取用户列表成功!',
            userList
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = {
            errMsg: '获取用户列表失败!',
            err
        }
    }
    await next();
}
const deleteUser = async (ctx, next) => {
    try {
        let ids = ctx.request.body.ids;
        if (ids.length > 1) {
            await UserModel.deleteAllUser(ids);
        } else if (ids.length === 1) {
            await UserModel.deleteUser(ids[0]);
        }
        
        ctx.status = 200;
        ctx.body = {
            successMsg: '删除用户成功!'
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = {
            errMsg: '删除用户失败!',
            err
        }
    }
    await next();
}
const updateUser = async (ctx, next) => {
    try {
        let user = ctx.request.body.user;
        user.password = crypto.createHmac('sha256', secret)
            .update(ctx.request.body.user.password)
            .digest('hex');
        await UserModel.updateUser(user._id, user);
        ctx.status = 200;
        ctx.body = {
            successMsg: '更新用户成功!'
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = {
            errMsg: '更新用户失败!',
            err
        }
    }
    await next();
}

module.exports = {
    login,
    register,
    userList,
    deleteUser,
    updateUser
};
