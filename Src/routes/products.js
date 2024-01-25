const express = require('express');
const router = express.Router();
const ProductManager = require('../productManager');
const { socketServer } = require('../app');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        let productsToSend = await productManager.getProducts();
        if (limit) {
            productsToSend = productsToSend.slice(0, parseInt(limit));
        }
        res.json(productsToSend);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const result = await productManager.addProduct(newProduct);
        const allProducts = await productManager.getProducts();
        result && socketServer.emit('updateProducts', allProducts);

        res.status(201).send('Producto agregado correctamente');
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;
        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const result = await productManager.deleteProduct(productId);
        const allProducts = await productManager.getProducts();
        result && socketServer.emit('updateProducts', allProducts);

        res.send('Producto eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
