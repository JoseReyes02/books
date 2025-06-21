const express = require('express');
const router = express.Router();
const User = require('../models/usuarios');
const Publicaciones = require('../models/inmueble');
const Likes = require('../models/likes');
const Guardar = require('../models/guardar');
const { isAuthenticated } = require('../helpers/auth');
const Inmueble = require('../models/inmueble');
const { v4 } = require('uuid');
const multer = require('multer');
const path = require('path');
// Usamos almacenamiento en memoria para que funcione bien en Heroku
const storage = multer.memoryStorage();

const { Readable } = require('stream');

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB por imagen
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|avif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("El archivo debe ser una imagen válida");
  }
});



const fs = require('fs-extra');

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})



router.get('/publicaciones/misPublicaciones', isAuthenticated, async (req, res) => {
    const misPublicaciones = await Publicaciones.find({ idUsuario: req.user.id });
    res.render('publicaciones/misPublicaciones', { misPublicaciones });
});

router.post('/publicaciones/cargarFotos',upload.array('image', 10), async (req, res) => {
const { idPublicacion } = req.body;
  const fotos = [];

  try {
    for (const file of req.files) {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: 'findmyhouse' },
        (error, result) => {
          if (error) throw error;
          fotos.push({
            idImagen: result.public_id,
            urlImagen: result.secure_url
          });

          // Cuando todas las imágenes estén listas:
          if (fotos.length === req.files.length) {
            Publicaciones.findByIdAndUpdate(
              idPublicacion,
              { $push: { fotos: { $each: fotos } } },
              { new: true }
            ).then(publicacionActualizada => {
              res.json({fotos: publicacionActualizada.fotos});
            });
          }
        }
      );

      bufferToStream(file.buffer).pipe(stream);
    }
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    res.json({ error: 'Error al subir imágenes' });
  }
});


router.post('/publicaciones/editarFotos', async (req, res) => {
    const { idPublicacion } = req.body;

    try {
        const imagen = req.file.filename;
        const uniqueID = v4();
        const fotos = ({
            id: uniqueID,
            imagen: imagen,
        })
        Publicaciones.findByIdAndUpdate(idPublicacion, { $push: { fotos: fotos } }, { new: true })
            .then(async (publicacionActualizada) => {
                if (!publicacionActualizada) {
                    console.log('Publicación no encontrada');
                    // Manejar el caso en el que no se encuentra la publicación
                } else {
                    const findImagenes = await Publicaciones.findById(idPublicacion);
                    const fotos = findImagenes.fotos;
                    res.json(fotos);
                }
            })
            .catch((error) => {
                console.error('Error al agregar el comentario:', error);
            });




    } catch (error) {

    }

});
router.post('/publicaciones/like', async (req, res) => {
    try {

        const idUser = req.user.id
        res.json(idUser)

    } catch (error) {
        const message = 'Primero debes iniciar session!'
        res.json(message)
    }

});

router.post('/publicaciones/quitarGuardado', async (req, res) => {
    try {
        const idUser = req.user.id
        res.json(idUser)

    } catch (error) {
        res.render('users/signin')
    }

});


router.post('/publicaciones/guardar', async (req, res) => {
    const { idGuardar } = req.body;
    if ((req.user && req.user.id)) {
        var idUser = req.user.id;
        const consulta = await Guardar.findOne({ guardar: 'guardado', idPublicacion: idGuardar, idUser: idUser });
        if (consulta) {
            await Guardar.findByIdAndDelete(consulta.id);
            var saveCount = await Guardar.find({ idPublicacion: idGuardar }).count();
            console.log(saveCount)
            await Inmueble.findByIdAndUpdate(idGuardar, { saveCount });


            const respuesta = {
                nomegusta: 'No Me gusta'
                // Puedes agregar más datos según tus necesidades
            };
            res.json(respuesta);
        } else {
            var guardar = 'guardado';
            var idPublicacion = idGuardar;
            const newSave = new Guardar({
                guardar, idUser, idPublicacion
            });

            await newSave.save();
            var saveCount = await Guardar.find({ idPublicacion: idGuardar }).count();
            console.log(saveCount)
            await Inmueble.findByIdAndUpdate(idGuardar, { saveCount });


            const respuesta = {
                megusta: 'Me gusta'
                // Puedes agregar más datos según tus necesidades
            };
            res.json(respuesta);
        }
    } else {
        const respuesta = {
            message: 'Primero debes iniciar session'
            // Puedes agregar más datos según tus necesidades
        };
        res.json(respuesta);
    }



})

router.get('/publicacion/edit/:id', async (req, res) => {
    const id = req.params.id
    const publicacion = await Publicaciones.findById(id)
    res.render('publicaciones/editPublicacion', { publicacion })

})

router.post('/publicacion/quitar', async (req, res) => {

    try {
        const { idPublicacion } = req.body
        const idUser = req.user.id
        res.send({
            idUser: idUser,
            idPublicacion: idPublicacion

        })
    } catch (error) {
        res.send({
            message: 'Primero debes iniciar session'
        })
    }


})


module.exports = router;


