const express = require('express');
const ProductManager = require('../productManager');
const router = express.Router();
const productManager = new ProductManager();

router.get('/', (req, res) => {
  res.render('home', { title: 'Página de Inicio' });
});

router.get('/products', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', {
      title: 'Listado de productos',
      products: products,
      style: "css/products.css",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  }
});

router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {
      title: 'Productos en tiempo real',
      products: products,
      style: "css/products.css",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos en tiempo real');
  }
});

module.exports = router;
