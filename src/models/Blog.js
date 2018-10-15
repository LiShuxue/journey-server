const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    subTitle: String,
    content: String,
    image: String,
    isOriginal: Boolean,
    publishTime: Date,
    see: Number,
    like: Number,
    category: String,
    tags: [String],
    comments: [Schema.Types.Mixed]
},{
    collection: 'Blog'
});

const Blog = mongoose.model('Blog', blogSchema);


const publishBlog = (blog) => {
    return Blog.create(blog);
}

const getAllBlog = () => {
    return new Promise((resolve, reject)=>{
        Blog.find({}, (err,doc)=>{
            if(err) reject(err);
            resolve(doc);
        });
    })
}
// const getAllBlogSortBySee = () => {
//     return new Promise((resolve, reject)=>{
//         Blog.find({}, (err,doc)=>{
//             if(err) reject(err);
//             resolve(doc);
//         }).sort({see: -1}).limit(10); // see字段降序排序，取前10条
//     })
// }

// const getAllTags = () =>{
//     return new Promise((resolve, reject)=>{
//         // 查找某一列
//         Blog.find({}, {tags: 1, _id: 0}, (err, doc)=>{
//             if(err) reject(err);
//             resolve(doc);
//         })
//     });
// }

module.exports = {
    publishBlog,
    getAllBlog
};