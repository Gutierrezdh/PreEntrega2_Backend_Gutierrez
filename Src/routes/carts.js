const express = require('express');
const router = express.Router();
const CartManager = require('../cartManager');
const cartManager = new CartManager();

router.post('/', (req, res) => {
    const newCart = req.body;
    cartManager.createCart(newCart);
    res.status(201).send('Carrito creado correctamente');
});

router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(1);
    cartManager.addProductToCart(cartId, productId, quantity);
    res.send('Producto agregado al carrito correctamente');
});

module.exports = router;
