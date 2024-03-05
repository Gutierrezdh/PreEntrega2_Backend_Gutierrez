const express = require('express');
const router = express.Router();
const {
    loginUser,
    signUpUser,
    failRegister,
    privateRoute,
    forgotPassword
} = require('../controller/session.controller.js');

router.post("/login", loginUser);
router.post("/signup", signUpUser);
router.get("/failRegister", failRegister);
router.get("/privado", auth, privateRoute);
router.post("/forgot", forgotPassword);

module.exports = router
