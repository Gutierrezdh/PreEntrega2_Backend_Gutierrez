const mongoose = require('mongoose');
const CartModel = require('./models/carts.model');

class CartManager {
    constructor() {
        this.carts = [];
        this.cartIdCounter = 1;
    }

    async createCart(newCart) {
        try {
            const cart = await CartModel.create({ products: [] });
            return cart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
        }
    }

    async getCartById(id) {
        try {
            const cartId = mongoose.Types.ObjectId(id);
            const cart = await CartModel.findById(cartId);
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito por ID:', error);
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            if (cart) {
                productId = mongoose.Types.ObjectId(productId);

                const existingProduct = cart.products.find((p) => p.product.equals(productId));
                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    cart.products.push({ product: productId, quantity });
                }

                await cart.save();
            } else {
                console.error('No se pudo agregar el producto al carrito.');
            }
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
        }
    }
}

module.exports = CartManager;