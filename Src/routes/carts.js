const express = require('express');
const router = express.Router();
const Cart = require('../models/carts.model');
const Product = require('../models/products.model');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
});

// Obtener detalles de un carrito por ID (populando los productos)
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.product');
        if (cart) {
            res.json({ status: 'success', payload: cart });
        } else {
            res.status(404).json({ status: 'error', payload: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el carrito por ID:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 'error', payload: 'Producto no encontrado' });
        }

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ status: 'error', payload: 'Carrito no encontrado' });
        }

        const existingProduct = cart.products.find(p => p.product.equals(productId));
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        const result = await cart.save();
        res.json({ status: 'success', payload: result });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
});

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ status: 'error', payload: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(p => !p.product.equals(productId));
        const result = await cart.save();

        res.json({ status: 'success', payload: result });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
});

// Actualizar carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updatedProducts = req.body.products || [];

        const cart = await Cart.findByIdAndUpdate(cartId, { products: updatedProducts }, { new: true });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
});

// Actualizar cantidad de ejemplares de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        const cart = await Cart.findOneAndUpdate(
            { _id: cartId, 'products.product': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
});

module.exports = router;
