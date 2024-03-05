const express = require('express');
const router = express.Router();
const UserModel = require('../dao/models/user.model');
const auth = require('../middlewares/auth');
const { createHash, isValidPassword } = require("../utils.js");
const passport = require("passport");

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const result = await UserModel.findOne({ email });

        if (result === null) {
            res.status(400).json({
                error: "Usuario o contraseña incorrectos",
            });
        } else if (!isValidPassword(result.password, password)) {
            res.status(401).json({
                error: "Usuario o contraseña incorrectos",
            });
        } else {
            req.session.user = email;
            req.session.name = result.first_name;
            req.session.last_name = result.last_name;
            req.session.role = "admin";
            res.status(200).json({
                respuesta: "ok",
            });
        }
    } catch (error) {
        console.error('Error al realizar el inicio de sesión:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
}

async function signUpUser(req, res) {
    try {
        // passport.authenticate("register") middleware maneja la autenticación aquí
        res.send({ status: "success", message: "usuario registrado" });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
}

function failRegister(req, res) {
    res.status(400).json({
        error: "Error al crear el usuario",
    });
}

function privateRoute(req, res) {
    res.render("topsecret", {
        title: "Privado",
        user: req.session.user,
    });
}

async function forgotPassword(req, res) {
    try {
        const { email, newPassword } = req.body;
        const result = await UserModel.find({ email: email });

        if (result.length === 0) {
            return res.status(401).json({
                error: "Usuario o contraseña incorrectos",
            });
        } else {
            const respuesta = await UserModel.findByIdAndUpdate(result[0]._id, {
                password: createHash(newPassword),
            });
            res.status(200).json({
                respuesta: "ok",
                datos: respuesta,
            });
        }
    } catch (error) {
        console.error('Error al realizar la recuperación de contraseña:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
}

module.exports = {
    loginUser,
    signUpUser,
    failRegister,
    privateRoute,
    forgotPassword
};

