// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/usuarios');

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password', // Se define, pero no se usa
//     passReqToCallback: true // Permite acceder a `req`
// }, async (req, email, password, done) => { // `password` no se usa
//     try {
      
//         const user = await User.findOne({ email: email });

//         if (!user) {
//             console.log('Usuario no encontrado');
//             return done(null, false);
//         }

       
//         return done(null, user); // Iniciar sesión sin contraseña

//     } catch (error) {
//         return done(error);
//     }
// }))
// passport.serializeUser((user,done) => {
//     done(null,user.id);

// });
// passport.deserializeUser((id,done) => {
//     User.findById(id,(err,user) =>{
//         done(err,user);
//     });
// });