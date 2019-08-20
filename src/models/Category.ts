import { Schema, Document, Model, model } from 'mongoose';

export interface ICategory extends Document {
    name: string
}

const categorySchema: Schema = new Schema({
    name: String
},{
    collection: 'Category'
});

const Category: Model<ICategory, {}> = model<ICategory>('Category', categorySchema);

const addCategory = (category: ICategory): Promise<ICategory> => {
    return Category.create(category);
}

const getAllCategory = (): Promise<ICategory[]> => {
    return new Promise((resolve, reject) => {
        Category.find({}, (err, doc)=>{
            if(err){
                reject(err);
            } 
            resolve(doc);
        })
    })
}

export default {
    addCategory,
    getAllCategory
}
