const express = require('express');
const router = express.Router();
const User = require('../models/usuarios');
const Inmueble = require('../models/inmueble');
const Imagen = require('../models/imagen');
const Likes = require('../models/likes');
const notificacion = require('../models/notifications');
const { isAuthenticated } = require('../helpers/auth'); 
const usuarios = require('../models/usuarios');
const Guardar = require('../models/guardar');
const imagen = require('../models/imagen');



router.get('/', async (req, res) => {

    // const imagenes = await Inmueble.find()
    try {
      
        const usuarioActualId = req.user.id;
        const meGusta = await Likes.find({ idUser: usuarioActualId });
    
        const publicaciones = await Inmueble.find({estado:'activa'});
        const notificaciones = await notificacion.find({ idUser: usuarioActualId ,estado:'noleido'});
        // Preprocesa los datos para marcar las publicaciones que el usuario ha dado "Me Gusta".
        const publicacionesConMeGusta = publicaciones.map(publicacion => {
            const haDadoMeGusta = meGusta.some(like => like.idPublicacion == publicacion._id && like.idUser === req.user.id);
            // const heGuardado = Gurdado.some(Save => Save.idPublicacion == publicacion._id && Save.idUser === req.user.id);
            return { ...publicacion._doc, haDadoMeGusta};
        });
        const ruta = '/'
        // Preprocesa los datos para marcar las publicaciones que el usuario ha dado "Me Gusta".
        res.render('index', { publicaciones: publicacionesConMeGusta,ruta ,notificaciones});
            // res.render('index', { datos, foto1, foto2, foto3, foto4 });

    } catch (error) {
        const publicaciones = await Inmueble.find({estado:'activa'});
        res.render('index',{publicaciones});
    }




});


router.post('/index',async(req,res) =>{
    const {pais,provincia,municipio,tipo_inmueble} = req.body
    const publicaciones = await Inmueble.find({ $or: [{provincia: provincia }, { municipio: municipio },{tipo_operacion:tipo_inmueble}], estado:'activa' })
    res.render('index',{publicaciones})


})


router.get('/publicar',isAuthenticated, async (req, res) => {
    const idUsuario = req.user.id;
    const publicacion = await Inmueble.findOne({idUsuario:idUsuario,estado: 'incompleta'});
    if(publicacion){
        const idPublicacion = publicacion.id;
        res.render('publicar',{idPublicacion,publicacion});
    }else{
        // const 
        const usuario = req.user.nombre
        const estado = 'incompleta';
        const photo = req.user.photo
        const newPublicacion = new Inmueble({estado,idUsuario,photo,usuario});
        await newPublicacion.save();
        const idPublicacion = newPublicacion.id;
        res.render('publicar',{idPublicacion});
    }

});


router.get('/vistaSeleccionado/:id',isAuthenticated, async (req, res) => {
    try {
        const idImagen = req.params.id;
        const publicacion = await Inmueble.find({ _id: idImagen });
        const publicaciones = await Inmueble.find({estado:'activa'});
        const datos = await Inmueble.find();
        res.render('vistaSeleccionado', { publicacion, datos,publicaciones });
        
    } catch (error) {
        res.redirect('/index');
    }

});


router.post('/like', async (req, res) => {
 
  
});


router.get('/about', isAuthenticated, async (req, res) => {
    res.render('about');
});


router.get('/servicios', isAuthenticated, async (req, res) => {
    res.render('servicios');
});


router.get('/delete/:id', async (req, res) => {
    const idImagen = req.params.id;
    console.log(idImagen)
    await Inmueble.findByIdAndDelete(idImagen);
    res.redirect('/');
});



module.exports = router;

