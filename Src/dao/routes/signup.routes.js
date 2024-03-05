const express = require('express');
const router = express.Router();
const {
    renderSignupPage
} = require('../controller/signup.controller.js');

router.get('/', renderSignupPage);

module.exports = router