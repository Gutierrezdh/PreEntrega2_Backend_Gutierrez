const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login', 
    { title: 'Inicia sesión' });
});

module.exports = router
