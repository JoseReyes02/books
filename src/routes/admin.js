const express = require('express');
const router = express.Router();

const User = require('../models/usuarios');
const Inmueble = require('../models/inmueble');


router.get('/admin/users', async (req, res) => {
    const usuarios = await User.find();
    res.render('admin/users', { usuarios });
});

router.get('/admin/publicaciones', async (req, res) => {
    const publicaciones = await Inmueble.find({estado:'activa'});
    res.render('admin/publicaciones', { publicaciones });
});




module.exports = router