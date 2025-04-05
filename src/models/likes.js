const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

 
const LikesSchema = new Schema({
    idPublicacion: {type: String, require: true},
    idUser: {type: String, require: true},
    like: {type: String, require: true},
    color: {type: String, require: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Likes', LikesSchema);