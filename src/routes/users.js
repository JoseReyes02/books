const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/usuarios');

const passport = require('passport');
const useragent = require('express-useragent');
const app = express();
router.use(useragent.express());




const { OAuth2Client } = require('google-auth-library');
const { isAuthenticated } = require('../helpers/auth');
require('dotenv').config()

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
)

router.get('/auth/google', (req, res) => {
    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email']
    })
    res.redirect(url)
});


router.get('/success', async (req, res) => {
      const code = req.query.code
     
    try {
        const { tokens } = await client.getToken(code)
    
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
    
        const payload = ticket.getPayload()
    
        const nombre = payload.name
        const email = payload.email
        const photo = payload.picture
        const estado = 'activo'
    
        // Buscar usuario en la base de datos
        let user = await User.findOne({ email: email })
    
        if (!user) {
            // Si no existe, crear usuario nuevo
            const totalUsers = await User.countDocuments({ estado: 'activo' })
            const secuencia = totalUsers + 1
    
            user = new User({ nombre, email, photo, estado, secuencia })
            await user.save()
    
        }
    
        // Login con passport (esto serializa el user)
        req.login(user, (err) => {
            if (err) {
                console.log(err)
                return res.redirect('/users/signin')
            }
    
             const dounload = true
            res.render('success',{dounload}) 
        })
    } catch (error) {
        console.log(error)
        res.render('success',{error})
    }

});
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signin' 

}));

router.get('/admin', (req, res) => {
    res.render('users/admin');
});

router.get('/users/signin', (req, res) => {
    if (req.user) {
       
        res.redirect('/');
    } else {

        res.render('users/signin');
    }

});


router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});


router.get('/setCookies', (req, res) => {
    res.cookie('newUser', false);
    res.cookie('isEmployee', true);


    res.send('you got the cookies');

});



router.get('/users/sendEmailToEMail', (req, res) => {
    res.render('users/sendEmailToImail');
});

router.get('/users/logout', (req, res) => {
    console.log('klk')
    req.logout((err) => {
        if (err) {
            // Manejar el error si lo hay
            return res.status(500).send('Error al cerrar sesión');
        }
        // Redirigir a la página de inicio de sesión o a cualquier otra página después de cerrar sesión
        res.redirect('/users/signin');
    });
})


module.exports = router;