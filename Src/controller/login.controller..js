const express = require('express');
const router = express.Router();

async function renderLoginPage(req, res) {
    try {
        res.render('login', { title: 'Inicia sesión' });
    } catch (error) {
        console.error('Error al renderizar la página de inicio de sesión:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
}

module.exports = {
    renderLoginPage
};