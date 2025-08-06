const express = require('express');
const router = express.Router();
const PUBLICACION = require('../models/publicacion')
const cloudinary = require('cloudinary')
const User = require('../models/usuarios')

const { isAuthenticated } = require('../helpers/auth');

const multer = require('multer');
const upload = multer();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


router.get('/', async (req, res) => {
  const publicacion = await PUBLICACION.findOne().sort({ _id: -1 });

  res.render('index',{publicacion});
});

router.get('/success', async (req, res) => {
      const code = req.query.code

    try {
        const { tokens } = await client.getToken(code)
    
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
    
        const payload = ticket.getPayload()
    
        const nombre = payload.name
        const email = payload.email
        const photo = payload.picture
        const estado = 'activo'
    
        // Buscar usuario en la base de datos
        let user = await User.findOne({ email: email })
    
        if (!user) {
            // Si no existe, crear usuario nuevo
            const totalUsers = await User.countDocuments({ estado: 'activo' })
            const secuencia = totalUsers + 1
    
            user = new User({ nombre, email, photo, estado, secuencia })
            await user.save()
    
        }
    
        // Login con passport (esto serializa el user)
        req.login(user, (err) => {
            if (err) {
                console.log(err)
                return res.redirect('/users/signin')
            }
    
             const dounload = true
            res.render('success',{dounload}) 
        })
    
    } catch (error) {
        console.log(error)
        res.redirect('/users/signin')
    }
  res.render('success');
});


router.post('/admin/register', async (req, res) => {
  const { titulo, escritor, comentario,urlPdf } = req.body
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  const urlImagen = result.secure_url;
  const idImagen = result.public_id
  const estado = "activo"
  const newBook = new PUBLICACION({ estado, titulo, escritor, comentario,urlImagen,idImagen,urlPdf })
  newBook.save()
  res.redirect('/')
});
module.exports = router;

