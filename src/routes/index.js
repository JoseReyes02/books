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

