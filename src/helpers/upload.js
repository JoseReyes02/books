// upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // 👈 asegúrate de que la ruta es correcta

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // 👈 este es el valor que debe estar presente
  params: {
    folder: 'alquiler_casas',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

module.exports = upload;
