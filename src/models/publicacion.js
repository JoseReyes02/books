const mongoose = require('mongoose');
const { Schema } = mongoose;

const PublicacionSchema = new Schema({
    
    titulo: {type: String, require: true},
    escritor: {type: String, require: true},
    comentario: {type: String, require: true},
    estado: {type: String, require: true},
   urlImagen: {type: String, require: true},
   idImagen: {type: String, require: true},
   urlPdf: {type: String, require: true},

    date: {type: Date, default: Date.now}
});
module.exports = mongoose.model('publicacion', PublicacionSchema);