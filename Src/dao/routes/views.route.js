const express = require('express');
const router = express.Router();
const {
  renderHomePage,
  renderLoginPage,
  renderProductsPage,
  renderRealTimeProductsPage,
  renderCartDetailsPage
} = require('../controller/views.controller.js');

router.get('/', renderHomePage);
router.get('/login', renderLoginPage);
router.get('/products', renderProductsPage);
router.get('/realtimeproducts', renderRealTimeProductsPage);
router.get('/carts/:cid', renderCartDetailsPage);

module.exports = router