const fs = require('fs');
const PRODUCTS_FILE = "./products.json";

class ProductManager {
    constructor() {
        this.path = PRODUCTS_FILE;
        this.products = [];
        this.productIdCounter = 1;
        this.initializeFile();
    }

    initializeFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                const lastProduct = this.products[this.products.length - 1];
                this.productIdCounter = lastProduct.id + 1;
            }
        } catch (error) {
            // Si el archivo no existe o está vacío, continúa con un array vacío
            this.products = [];
        }
    }

    saveToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar el archivo:', error);
        }
    }

    addProduct(product) {
        const { title, description, price, code, stock, thumbnails } = product;
        if (!title || !description || !price || !code || !stock) {
            console.error('Todos los campos son obligatorios, excepto thumbnails.');
            return;
        }

        const codeExists = this.products.some((prod) => prod.code === code);
        if (codeExists) {
            console.error('Ya existe un producto con este código.');
            return;
        }

        const newProduct = {
            id: this.productIdCounter,
            title,
            description,
            code,
            price: Number(price),
            status: true,
            stock: Number(stock),
            thumbnails: thumbnails || []
        };

        this.products.push(newProduct);
        this.productIdCounter++;
        this.saveToFile();
        console.log('Producto agregado:', newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const productId = parseInt(id);
        const product = this.products.find((prod) => prod.id === productId);
        if (product) {
            return product;
        } else {
            console.error('Producto no encontrado');
        }
    }

    updateProduct(id, updatedFields) {
        const productId = parseInt(id);

        const index = this.products.findIndex((product) => product.id === productId);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            this.saveToFile();
            return this.products[index];
        } else {
            console.error('Producto no encontrado');
        }
    }

    deleteProduct(id) {
        const productId = parseInt(id);
        this.products = this.products.filter((product) => product.id !== productId);
        this.saveToFile();
        console.log('Producto eliminado');
    }
}

module.exports = ProductManager;
