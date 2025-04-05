const mongoose = require('mongoose');
const { Schema } = mongoose;


const ImagenSchema = new Schema({
    nombreUser: {type: String, require: true},
    fotos: {type: String, require: true},
    estadoImage: {type: String, require: true},
    carrousel: {type: String, require: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Imagen', ImagenSchema);