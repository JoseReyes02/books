const express = require('express');
const router = express.Router();
const User = require('../models/usuarios');
const Publicaciones = require('../models/inmueble');
const Likes = require('../models/likes');
const Guardar = require('../models/guardar');
const { isAuthenticated } = require('../helpers/auth');
const Inmueble = require('../models/inmueble');
const Imagen = require('../models/imagen');


router.get('/dasboard/users',async (req,res) => {
    const users = await User.find();
   res.render('dasboard/users', {users});
})
router.get('/dasboard/carrouselPrincipal',async (req,res) => {
    const imagenes = await Imagen.find();
   res.render('dasboard/carrouselPrincipal', {imagenes});
});

router.post('/dasboard/GuardarImagenCarrousel',async (req,res) => {
    const { idImagen } = req.body;
    var carrousel = 'inactivo';
    const imagen = await Imagen.findOne({carrousel: 'activa'});
    if(imagen){
        await Imagen.findByIdAndUpdate(imagen.id,{carrousel});

        carrousel = 'activa';
        await Imagen.findByIdAndUpdate(idImagen , {carrousel});
        res.redirect('/dasboard/carrouselPrincipal');
    }else{
        carrousel = 'activa';
        await Imagen.findByIdAndUpdate(idImagen , {carrousel});
        res.redirect('/dasboard/carrouselPrincipal');
    }

  
})

module.exports = router;