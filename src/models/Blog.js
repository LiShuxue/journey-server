const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
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

const updateBlog = (id, blog) => {
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

const deleteBlog = (id) => {
    return new Promise((resolve, reject)=>{
        Blog.deleteOne({
            _id: id
        }, (err) => {
            if(err) reject(err);
            resolve();
        })
    })
}

const deleteAllBlog = (ids) => {
    let promiseArr = ids.map(id => {
        return deleteBlog(id)
    });
    return Promise.all(promiseArr);
}


module.exports = {
    publishBlog,
    getAllBlog,
    updateBlog,
    deleteAllBlog
};