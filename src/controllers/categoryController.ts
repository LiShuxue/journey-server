import CategoryModel, { ICategory } from '../models/Category';
import sentry from '../utils/sentry';
import { Context } from 'koa';

const addCategory = async ( ctx: Context ): Promise<any> => {
    sentry.addBreadcrumb('controllers/categoryController.js --> addCategory');
    let category: ICategory = ctx.request.body.category;
    try {
        await CategoryModel.addCategory(category);
        ctx.status = 200;
        ctx.body = {
            successMsg: '添加类别成功!'
        }
    } catch (err) {
        sentry.captureException(err);
        ctx.status = 500;
        ctx.body = {
            errMsg: '添加类别失败!',
            err
        }
    }
}

const getAllCategory = async ( ctx: Context ): Promise<any> => {
    sentry.addBreadcrumb('controllers/categoryController.js --> getAllCategory');
    try {
        let categoryList: ICategory[] = await CategoryModel.getAllCategory();
        ctx.status = 200;
        ctx.body = {
            successMsg: '查找类别成功!',
            categoryList
        }
    } catch (err) {
        sentry.captureException(err);
        ctx.status = 500;
        ctx.body = {
            errMsg: '查找类别失败!',
            err
        }
    } 
}

export default {
    addCategory,
    getAllCategory
}