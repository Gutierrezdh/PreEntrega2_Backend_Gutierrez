const express = require('express');
const ProductManager = require('../productManager');
const router = express.Router();
const productManager = new ProductManager();

router.get('/', (req, res) => {
  res.render('home', { title: 'Página de Inicio' });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get('/products', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const allProducts = await productManager.getProducts();
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const products = allProducts.slice(startIndex, endIndex);

    res.render('products', {
      title: 'Listado de productos',
      products,
      currentPage: page,
      totalPages: Math.ceil(allProducts.length / limit),
      style: 'css/products.css',
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos en tiempo real');
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      res.render('cartDetails', {
        title: `Carrito ${cartId}`,
        cart,
      });
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el carrito');
  }
});

module.exports = router;
