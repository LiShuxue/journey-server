import { Context } from 'koa';

let login: string = '/blog-api/admin/login';
let register: string = '/blog-api/admin/register';
let categoryList: string = '/blog-api/blog/category/list';
let blogList: string = '/blog-api/blog/list';
let blogDetail: string = '/blog-api/blog/detail?id=';
let likeBlog: string = '/blog-api/blog/like';

let notNeedTokenUrlList: string[] = [login, register, categoryList, blogList, blogDetail, likeBlog];

export function handleNotNeedTokenUrl(ctx: Context): boolean {
  let url: string = ctx.url;
  
  return notNeedTokenUrlList.some((value) => {
    return url.includes(value);
  });
}
