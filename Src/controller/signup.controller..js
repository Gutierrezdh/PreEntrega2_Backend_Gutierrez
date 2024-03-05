const express = require('express');
const router = express.Router();

async function renderSignupPage(req, res) {
    try {
        res.render('signup', { title: 'Crea una cuenta' });
    } catch (error) {
        console.error('Error al renderizar la página de registro:', error);
        res.status(500).json({ status: 'error', payload: 'Error interno del servidor' });
    }
}

module.exports = renderSignupPage;
