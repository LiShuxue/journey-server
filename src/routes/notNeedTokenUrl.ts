import { Context } from 'koa';

const login: string = '/blog-api/admin/login';
const register: string = '/blog-api/admin/register';
const categoryList: string = '/blog-api/blog/category/list';
const blogList: string = '/blog-api/blog/list';
const blogDetail: string = '/blog-api/blog/detail?id=';
const likeBlog: string = '/blog-api/blog/like';
const addComments: string = '/blog-api/blog/comment/add';
const homeinfo: string = '/blog-api/common/homeinfo';

const notNeedTokenUrlList: string[] = [
  login,
  register,
  categoryList,
  blogList,
  blogDetail,
  likeBlog,
  addComments,
  homeinfo,
];

export function handleNotNeedTokenUrl(ctx: Context): boolean {
  const url: string = ctx.url;

  return notNeedTokenUrlList.some((value) => {
    return url.includes(value);
  });
}
