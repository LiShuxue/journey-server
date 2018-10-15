const UserModel = require('../models/User');
const crypto = require('crypto');
const secret = 'secret-key';
const tokenUtil = require('../utils/tokenUtil');

const login = async ( ctx ) => {
    let username = ctx.request.body.username;
    let hashPass = crypto.createHmac('sha256', secret)
        .update(ctx.request.body.password)
        .digest('hex');

    let doc = await UserModel.getUser(username).catch((err)=>{
        ctx.status = 500;
        ctx.body = {
            errMsg: '数据库查找用户名出错!',
            err
        }
    });

    if(!doc){
        ctx.status = 200;
        ctx.body = {
            errMsg: '用户名不存在!'
        }
    }else if(doc.password !== hashPass){
        ctx.status = 200;
        ctx.body = {
            errMsg: '密码错误!'
        }
    }else{
        let access_token = tokenUtil.createAccessToken({username});
        let refresh_token = tokenUtil.createRefreshToken();
        let result = await Promise.all([
            UserModel.saveAccessToken(doc, access_token),
            UserModel.saveRefreshToken(doc, refresh_token)
        ]).catch((err)=>{
            ctx.status = 500;
            ctx.body = { 
                errMsg: '数据库保存token出错!',
                err
            };
        });
        ctx.status = 200;
        ctx.body = { 
            successMsg: '登录成功!',
            username,
            access_token,
            refresh_token
        };
    }
}

const register = async ( ctx ) => {
    let hashPass = crypto.createHmac('sha256', secret)
        .update(ctx.request.body.password)
        .digest('hex');
    let username = ctx.request.body.username;
    let access_token = tokenUtil.createAccessToken({username});
    let refresh_token = tokenUtil.createRefreshToken();
    let user = {
        username: username,
        password: hashPass,
        access_token: access_token,
        refresh_token: refresh_token
    };
    
    let doc = await UserModel.getUser(username).catch((err)=>{
        ctx.status = 500;
        ctx.body = {
            errMsg: '数据库查找用户名出错!',
            err
        }
    });

    if(doc){
        ctx.status = 200;
        ctx.body = {
            errMsg: '用户名已存在!'
        };
    }else{
        let result = await UserModel.createUser(user).catch((err)=>{
            ctx.status = 500;
            ctx.body = {
                errMsg: '注册失败!',
                err
            }
        });

        if(result && result._id){
            ctx.status = 200;
            ctx.body = {
                successMsg: '注册成功!',
                username: result.username,
                access_token: result.access_token,
                refresh_token: result.refresh_token
            }
        }else{
            ctx.status = 200;
            ctx.body = {
                errMsg: '注册失败!'
            }
        }
    }
}

module.exports = {
    login,
    register
};
