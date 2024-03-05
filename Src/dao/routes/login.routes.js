const express = require('express');
const renderLoginPage = require('../controller/login.controller.js');

router.get('/', renderLoginPage);

module.exports = router