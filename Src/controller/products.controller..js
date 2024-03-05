const express = require('express');
const router = express.Router();
const ProductManager = require('../productManager');
const { socketServer } = require('../app');
const mongoose = require('mongoose');
const productManager = new ProductManager();

// Obtener todos los productos
async function getProducts(req, res) {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;

        // Construye el objeto de opciones para la paginación
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        // Construye el objeto de opciones para la búsqueda
        const searchOptions = {};

        if (query) {
            // Búsqueda por nombre o descripción (insensible a mayúsculas y minúsculas)
            searchOptions.$or = [
                { title: { $regex: new RegExp(query, 'i') } },
                { description: { $regex: new RegExp(query, 'i') } }
            ];
        }

        // Realiza la búsqueda y paginación usando mongoosePaginate
        const result = await productManager.getProductsPaginated(searchOptions, options);

        // Ordena los resultados si se proporciona el parámetro de ordenamiento
        if (sort === 'asc') {
            result.docs = result.docs.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            result.docs = result.docs.sort((a, b) => b.price - a.price);
        }

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null
        };

        res.json(response);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
}

async function getProductById(req, res) {
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
}

async function addProduct(req, res) {
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
}

async function updateProduct(req, res) {
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
}

async function deleteProduct(req, res) {
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
}

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
