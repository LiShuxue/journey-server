import { InsertOneResult, ObjectId } from 'mongodb';
import mongodb from '../db/mongodb';

interface IImage {
  name: string;
  url: string;
}
interface ITag {
  [index: number]: string;
}

export interface IReply extends IComment {
  parentId: string;
  replyName: string;
  replyEmail: string;
  replyContent: string;
}

export interface IComment {
  id: string;
  arthur: string;
  date: number;
  content: string;
  email: string;
  reply: IReply[];
  isHide: boolean;
}

export interface IBlog {
  title: string;
  subTitle: string;
  htmlContent: string;
  markdownContent: string;
  image: IImage;
  isOriginal: boolean;
  publishTime: number;
  updateTime: number;
  see: number;
  like: number;
  category: string;
  tags: ITag;
  comments: IComment[];
}

export interface ISimpleBlog {
  title: string;
  subTitle: string;
  image: IImage;
  isOriginal: boolean;
  publishTime: number;
  updateTime: number;
  see: number;
  like: number;
  category: string;
  tags: ITag;
}

const Blog = mongodb.getCollection('Blog');

const publishBlog = async (blog: IBlog) => {
  const result: InsertOneResult = await Blog.insertOne(blog);
  return result;
};

const getAllBlog = async () => {
  const query = {};
  const options = {
    sort: { publishTime: -1 },
    projection: { htmlContent: 0, markdownContent: 0, comments: 0 }
  };

  const cursor = await Blog.find(query, options as any);
  return cursor.toArray();
};

const getBlogDetailById = async (id: string) => {
  const query = { _id: new ObjectId(id) };
  const blog = await Blog.findOne(query);
  return blog;
};

const updateSeeAccount = async (blog: any) => {
  const filter = { _id: new ObjectId(blog._id) };
  const updateDoc = {
    $set: { see: blog.see + 1 }
  };

  const result = await Blog.updateOne(filter, updateDoc);
  return result;
};

const updateLikeAccount = async (blog: any, like: number) => {
  const filter = { _id: new ObjectId(blog._id) };
  const updateDoc = {
    $set: { like }
  };

  const result = await Blog.updateOne(filter, updateDoc);
  return result;
};

const updateComments = async (blog: any, comments: IComment[]) => {
  const filter = { _id: new ObjectId(blog._id) };
  const updateDoc = {
    $set: { comments }
  };

  const result = await Blog.updateOne(filter, updateDoc);
  return result;
};

const updateBlog = async (id: string, blog: any) => {
  const filter = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      title: blog.title,
      subTitle: blog.subTitle,
      htmlContent: blog.htmlContent,
      markdownContent: blog.markdownContent,
      image: blog.image,
      isOriginal: blog.isOriginal,
      updateTime: Date.now(),
      category: blog.category,
      tags: blog.tags
    }
  };

  const result = await Blog.updateOne(filter, updateDoc);
  return result;
};

const deleteBlog = async (id: string) => {
  const query = { _id: new ObjectId(id) };
  const result = await Blog.deleteOne(query);
  return result;
};

const deleteAllBlog = (ids: string[]): Promise<any> => {
  let promiseArr = ids.map(id => {
    return deleteBlog(id);
  });
  return Promise.all(promiseArr);
};

export default {
  publishBlog,
  getAllBlog,
  updateBlog,
  deleteAllBlog,
  getBlogDetailById,
  updateSeeAccount,
  updateLikeAccount,
  updateComments
};
