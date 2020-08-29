import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {}

    public products: Product[] = [];


    async insertProduct(title: string, desc: string, price: number) {
        const product = new this.productModel({
            title,
            description: desc,
            price
        });
        const result = await product.save();
        return result.id as string;
    }

    getAllProducts() {
        return [...this.products];
    }

    getSingleProduct(id) {
       const product = this.findProduct(id)[0];
       return {...product};
    }

    updateProduct(id: string, title: string, desc: string, price: number) {
        const [product, productIndex] = this.findProduct(id);
        const updatedProduct = {...product};
        if (title) {
            updatedProduct.title = title;
        }
        if (desc) {
            updatedProduct.description = desc;
        }
        if (price) {
            updatedProduct.price = price;
        }
        this.products[productIndex] = updatedProduct;
    }

    deleteProduct(id) {
        const productIndex = this.findProduct(id)[1];
        this.products.splice(productIndex, 1);
     }

    private findProduct(id: string): [Product, number] {
        const productIndex = this.products.findIndex((prod) => prod.id === id);
        const product = this.products[productIndex];
        if (!product) {
            throw new NotFoundException('Could Not Found Product.');
        }
        return [product, productIndex];
    }

}
