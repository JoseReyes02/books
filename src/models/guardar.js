const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;


const GuardarSchema = new Schema({
    idPublicacion: {type: String, require: true},
    idUser: {type: String, require: true},
    guardar: {type: String, require: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('guardar', GuardarSchema);