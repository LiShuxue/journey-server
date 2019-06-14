const CategoryModel = require('../models/Category');

const addCategory = async (ctx, next) => {
    let category = ctx.request.body.category;
    try {
        await CategoryModel.addCategory(category);
        ctx.status = 200;
        ctx.body = {
            successMsg: '添加类别成功!'
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = {
            errMsg: '添加类别失败!',
            err
        }
    }
    await next();
}

const getAllCategory = async (ctx) => {
    try {
        let categoryList = await CategoryModel.getAllCategory();
        ctx.status = 200;
        ctx.body = {
            successMsg: '查找类别成功!',
            categoryList
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = {
            errMsg: '查找类别失败!',
            err
        }
    } 
}

module.exports = {
    addCategory,
    getAllCategory
}