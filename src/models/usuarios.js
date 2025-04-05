const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;


const UserSchema = new Schema({
    nombre: { type: String, require: true },
    apellido: { type: String, require: true }, 
    email: { type: String, require: true },
    telefono: { type: String, require: true },
    photo: { type: String, require: true },
    password: { type: String, require: true },
    passwordshow: { type: String, require: true },
    rol: { type: String, require: true },
    secuencia: { type: Number, require: true },
    date: { type: Date, default: Date.now }
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);