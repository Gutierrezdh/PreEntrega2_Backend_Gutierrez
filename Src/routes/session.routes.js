const express = require('express');
const router = express.Router();
const userModel = require('../models/user.model');
const auth = require('../middlewares/auth');

router.post('/login', async  (req, res) => {
    const { email, password } = req.body;
    const result = await userModel.findOne( { email });
    console.log(email, password, result);
    if (result === null) {
        res.status(400).json({ error: 'Credenciales incorrectas' });
    } else {
        req.session.user = email;
        req.session.role = result.role || 'user';
        res.status(200).json({ message: 'ok' });
    }
})

router.post('/signup', async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {
        const newUser = await userModel.create({ first_name, last_name, email, password, age, role: 'user' });
        req.session.user = email;
        req.session.role = newUser.role || 'user';
        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(400).json({ error: 'Error al crear el usuario' });
    }
});

router.get("/privado", auth, (req, res) => {
    res.render("privado", {
    title: "Privado",
    user: req.session.user,
    });
});

module.exports = router;
