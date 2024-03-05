const mongoose = require('mongoose');
const ProductModel = require('./dao/models/products.model');

class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    async addProduct(product) {
        const { id, title, description, price, code, stock, thumbnails } = product;
    
        try {
            console.log('Datos del producto recibidos:', product);    
            // Verificar si ya existe un producto con el mismo código
            const codeExists = await ProductModel.exists({ code });
            if (codeExists) {
                console.error('Ya existe un producto con este código.');
                return;
            }
    
            const newProduct = await ProductModel.create({
                id,
                title,
                description,
                code,
                price: Number(price),
                status: true,
                stock: Number(stock),
                thumbnails: thumbnails || [],
            });
    
            console.log('Producto agregado:', newProduct);
            return newProduct;
        } catch (error) {
            console.error('Error al agregar un producto:', error);
        }
    }
    

    async getProducts() {
        try {
            const products = await ProductModel.find();
            return products;
        } catch (error) {
            console.error('Error al obtener todos los productos:', error);
        }
    }

    async getProductById(id) {
        try {
            const productId = mongoose.Types.ObjectId(id);
            const product = await ProductModel.findById(productId);
            return product;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
        }
    }    

    async updateProduct(id, updatedFields) {
        try {
            console.log('Entrando a updateProduct');
            console.log('ID recibido:', id);
            console.log('Campos actualizados recibidos:', updatedFields);
    
            const filter = { id: id }; 
            const update = { $set: updatedFields };
            const options = { new: true, useFindAndModify: false };
    
            const updatedProduct = await ProductModel.findOneAndUpdate(filter, update, options);
    
            if (updatedProduct) {
                console.log('Producto actualizado:', updatedProduct);
                return updatedProduct;
            } else {
                console.error('Producto no encontrado');
                return null;
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }
    

    async deleteProduct(id) {
        try {
            const result = await ProductModel.deleteOne({ id: id });
    
            if (result.deletedCount > 0) {
                console.log('Producto eliminado');
                return result;
            } else {
                console.error('No se encontró un producto con el ID proporcionado.');
                return null; 
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error; 
        }
    }
}

module.exports = ProductManager;