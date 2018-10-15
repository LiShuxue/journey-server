const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String
},{
    collection: 'Category'
});

const Category = mongoose.model('Category', categorySchema);

const addCategory = (category) => {
    return Category.create(category);
}

const getAllCategory = () => {
    return new Promise((resolve, reject) => {
        Category.find({}, (err, doc)=>{
            if(err){
                reject(err);
            } 
            resolve(doc);
        })
    })
}

module.exports = {
    addCategory,
    getAllCategory
}
