const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/usuarios');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done, req, res) => {

    const user = await User.findOne({ email: email });

    if (!user) {
        return done(null, false, console.log('Usuario no encontrado'));

    }else if(user && !user.password){ 
        return done(null, false, console.log('Error al iniciar sesión..'));
    } else {
        const match = await user.matchPassword(password);
        if (match) {
            return done(null, user);
        } else {
            return done(null, false, console.log('Contraseña incorrecta'));
        }
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id);

});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});