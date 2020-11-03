import { Schema, Document, Model, model } from 'mongoose';

interface IImage {
    name: string,
    url: string
}
interface ITag {
    [index: number]: string
}

export interface IReply extends IComment {
    parentId: string,
    replyName: string,
}

export interface IComment {
    id: string,
    arthur: string,
    date: number,
    content: string,
    email: string,
    reply: IReply[],
    isHide: boolean
}

export interface IBlog extends Document {
    title: string,
    subTitle: string,
    htmlContent: string,
    markdownContent: string,
    image: IImage,
    isOriginal: boolean,
    publishTime: number,
    updateTime: number,
    see: number,
    like: number,
    category: string,
    tags: ITag,
    comments: IComment[]
}

export interface ISimpleBlog extends Document {
    title: string,
    subTitle: string,
    image: IImage,
    isOriginal: boolean,
    publishTime: number,
    updateTime: number,
    see: number,
    like: number,
    category: string,
    tags: ITag
}

const blogSchema: Schema = new Schema({
    title: String,
    subTitle: String,
    htmlContent: String,
    markdownContent: String,
    image: {
        name: String,
        url: String
    },
    isOriginal: Boolean,
    publishTime: Number,
    updateTime: Number,
    see: Number,
    like: Number,
    category: String,
    tags: [String],
    comments: [Schema.Types.Mixed]
},{
    collection: 'Blog'
});

const Blog: Model<IBlog, {}> = model<IBlog>('Blog', blogSchema);


const publishBlog = (blog: IBlog): Promise<IBlog> => {
    return Blog.create(blog);
}

/**
 * Modal.find(filter, projection, callback)
 * projection以文档的形式列举结果集中要包含或者排除的字段。
 * 可以指定要包含的字段,例如:｛field: 1｝,或者指定要排除的字段,例如:｛field：0｝
 * 
 * 返回bolg集合，但是排除 'htmlContent' 'comments' 和 'markdownContent' 字段
 */
const getAllBlog = (): Promise<ISimpleBlog[]> => {
    return new Promise((resolve, reject)=>{
        Blog.find({}, { htmlContent: 0, markdownContent: 0, comments: 0 }, (err,doc)=>{
            if(err) reject(err);
            resolve(doc);
        }).sort({publishTime: -1});
    })
}

const getBlogDetailById = (id: string): Promise<IBlog> => {
    return new Promise((resolve, reject) => {
        Blog.findById(id, (err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    });
}

const updateSeeAccount = (blog: IBlog): Promise<IBlog> => {
    return new Promise((resolve, reject) => {
        Blog.updateOne({ _id: blog.id }, {
            $set: { see: blog.see + 1 }
        }, (err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    })
}

const updateLikeAccount = (blog: IBlog, like: number): Promise<IBlog> => {
    return new Promise((resolve, reject) => {
        Blog.updateOne({ _id: blog.id }, {
            $set: { like: like }
        }, (err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    })
}

const updateComments = (blog: IBlog, comments: IComment[]): Promise<IBlog> => {
    return new Promise((resolve, reject) => {
        Blog.updateOne({ _id: blog.id }, {
            $set: { comments: comments }
        }, (err, doc) => {
            if (err) reject(err)
            resolve(doc)
        })
    })
}

const updateBlog = (id: string, blog: IBlog): Promise<IBlog> => {
    return new Promise((resolve, reject)=>{
        Blog.updateOne({ 
            _id: id
        }, {
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
        }, (err, doc)=>{
            if(err) reject(err);
            resolve(doc);
        });
    })
}

const deleteBlog = (id: string): Promise<any> => {
    return new Promise((resolve, reject)=>{
        Blog.deleteOne({
            _id: id
        }, (err) => {
            if(err) reject(err);
            resolve();
        })
    })
}

const deleteAllBlog = (ids: string[]): Promise<any> => {
    let promiseArr = ids.map(id => {
        return deleteBlog(id)
    });
    return Promise.all(promiseArr);
}


export default {
    publishBlog,
    getAllBlog,
    updateBlog,
    deleteAllBlog,
    getBlogDetailById,
    updateSeeAccount,
    updateLikeAccount,
    updateComments
}