const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;


const ChatSchema = new Schema({
    mensajes:[],
    idConversacion: {type: String, require: true},
    colorMessages: {type: String, require: true},
    userEmisor:{type: String, require: true},

    nombreReceptor:{type: String, require: true},
    fotoReceptor:{type: String, require: true},
    userReceptor: {type: String, require: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('chat', ChatSchema);