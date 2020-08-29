import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

    constructor(public productService: ProductsService) {}

    @Post()
    async addProduct(
        @Body('title') prodTitle: string,
        @Body('description') desc: string,
        @Body('price') price: number
        ) {
        const generatedId = await this.productService.insertProduct(prodTitle, desc, price);
        return {id: generatedId};
    }

    @Get()
    getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get(':id')
    getSingleProduct(@Param('id') prodId: string) {
        return this.productService.getSingleProduct(prodId);
    }

    @Patch(':id')
    updateProduct(
        @Param('id') prodId: string,
        @Body('title') title: string,
        @Body('description') desc: string,
        @Body('price') price: number,
        ) {
        this.productService.updateProduct(prodId, title, desc, price);
        return 'updated product';
    }

    @Delete(':id')
    deleteProduct(@Param('id') prodId: string) {
        this.productService.deleteProduct(prodId);
        return 'product deleted Successfully';
    }

}
