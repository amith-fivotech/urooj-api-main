import * as mongoose from 'mongoose';

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

export const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
}, { versionKey: false })


export class Product {
    id: string;
    title: string;
    description: string;
    price: number
}