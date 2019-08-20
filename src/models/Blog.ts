import { Schema, Document, Model, model } from 'mongoose';

interface IImage {
    name: string,
    url: string
}
interface ITag {
    [index: number]: string
}
interface IComment {
    arthur: string,
    date: Date,
    content: string
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
    publishTime: Date,
    updateTime: Date,
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

const getAllBlog = (): Promise<IBlog[]> => {
    return new Promise((resolve, reject)=>{
        Blog.find({}, (err,doc)=>{
            if(err) reject(err);
            resolve(doc);
        });
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
    deleteAllBlog
}