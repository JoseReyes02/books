const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    idConversacion:{type: String, require: true}, 
    mensaje: {type: String, require: true}, 
    idUser: {type: String, require: true},
    userReceptor: {type: String, require: true},
    NameUserSend: {type: String, require: true},
    ultimoId: {type: String, require: true},
    estado: {type: String, require: true},
    photo: {type: String, require: true},
    fecha: {type: String, require: true},
    date: {type: Date, default: Date.now}
});
module.exports = mongoose.model('Notification', NotificationSchema);