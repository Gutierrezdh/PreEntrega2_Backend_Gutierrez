const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {    
    res.render('signup', { title: 'Crea una cuenta' });
});

module.exports = router