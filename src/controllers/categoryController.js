const CategoryModel = require('../models/Category');

const addCategory = async (ctx, next) => {
    let category = ctx.request.body.category;
    let result = await CategoryModel.addCategory(category).catch((err)=>{
        ctx.status = 500;
        ctx.body = {
            errMsg: '添加类别失败!',
            err
        }
    });
    if(result && result._id){
        ctx.status = 200;
        ctx.body = {
            successMsg: '添加类别成功!'
        }
    }else{
        ctx.status = 200;
        ctx.body = {
            errMsg: '添加类别失败!'
        }
    }

    await next();
}

const getAllCategory = async (ctx) => {
    let categoryList = await CategoryModel.getAllCategory().catch((err)=>{
        ctx.status = 500;
        ctx.body = {
            errMsg: '查找类别失败!',
            err
        }
    });
    ctx.status = 200;
    ctx.body = {
        successMsg: '查找类别成功!',
        categoryList
    }
}

module.exports = {
    addCategory,
    getAllCategory
}