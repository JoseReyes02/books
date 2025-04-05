const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;


const InmuebleSchema = new Schema({ 
    idUsuario: {type: String, require: true},
    usuario: {type: String, require: true},
    numPublicacion: {type: String, require: true},
    tipo_operacion: {type: String, require: true},
    titulo: {type: String, require: true},
    publicacion: {type: String, require: true},
    inlineRadioOptions: {type: String, require: true},
    tipoPropiedad: {type: String, require: true},
    restron: {type: String, require: true},
    precio: {type: String, require: true},
    moneda: {type: String, require: true},
    disponivilidad: {type: String, require: true}, 
    habitaciones: {type: String, require: true},
    marquesinas: {type: String, require: true},
    pais: {type: String, require: true},
    provincia: {type: String, require: true},
    municipio: {type: String, require: true},
    descripcion: {type: String, require: true},
    fecha: {type: String, require: true},
    hora: {type: String, require: true},
    nombre: {type: String, require: true},
    apellido: {type: String, require: true},
    telefono: {type: String, require: true},
    email: {type: String, require: true},
    instagram: {type: String, require: true},
    direccion: {type: String, require: true},
    fotos: [],
    saveUser: [],
    estado: {type: String, require: true},
    photo: {type: String, require: true},
    likeCount: {type: Number, require: true},
    saveCount: {type: Number, require: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Inmueble', InmuebleSchema);