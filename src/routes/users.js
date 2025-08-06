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
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/signin' 

}));

router.get('/auth/google/callback', async (req, res) => {
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
    
            // Opcional: Enviar email de bienvenida
            const deviceInfo = {
                browser: req.useragent.browser,
                version: req.useragent.version,
                os: req.useragent.os,
                platform: req.useragent.platform,
                device: req.useragent.isMobile ? 'Móvil' : req.useragent.isDesktop ? 'PC' : 'Desconocido'
            }
    
            const platform = deviceInfo.platform
            const device = deviceInfo.device  
    
            const contentHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4CAF50;">¡Inicio de sesión exitoso en FindMyHouse! 🏡</h2>
                <p>Hola,</p>
                <p>Has iniciado sesión en tu cuenta de <strong>FindMyHouse</strong>.</p>
                <ul style="background: #f9f9f9; padding: 15px; border-radius: 5px; list-style: none;">
                    <li><strong>📅 Fecha:</strong> ${new Date().toLocaleString()}</li>
                    <li><strong>📍 Plataforma:</strong> ${platform}</li>
                    <li><strong>🖥 Dispositivo:</strong> ${device}</li>
                </ul>
            </div>`
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'findmyhouse57@gmail.com',
                    pass: 'mktoxcekrsrceebl'
                }
            })
    
            const mailOptions = {
                from: '"FindMyHouse" <findmyhouse57@gmail.com>',
                to: email,
                subject: 'Iniciaste sesión en FindMyHouse!',
                html: contentHTML,
            }
    
            await transporter.sendMail(mailOptions)
        }
    
        // Login con passport (esto serializa el user)
        req.login(user, (err) => {
            if (err) {
                console.log(err)
                return res.redirect('/users/signin')
            }
    
            // Usuario logueado correctamente
            res.redirect('/')  // Cambia por la ruta que quieras
        })
    
    } catch (error) {
        console.log(error)
        res.redirect('/users/signin')
    }
    
})

router.get('/admin', (req, res) => {
    res.render('admin');
});

router.post('/admin', async (req, res, next) => {
    var { email, password } = req.body;
    const query = await User.findOne({ email: email });
    if (query) {
        if (query.rol === 'admin') {
            passport.authenticate('local', {
                successRedirect: '/users/adminDasboard',
                failureRedirect: '/admin'

            })(req, res, next);
        } else if (query.rol !== 'admin') {
            console.log("usuario no permitido");
        }
    } else {
        var mesage = 'Usuario no existe'
        res.render('admin', { mesage })
    }

    // res.render('admin');
});



router.get('/users/adminDasboard', (req, res) => {
    res.render('users/adminDasboard');
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


//REGISTRO DE USUARIO
router.post('/users/signup', async (req, res) => {
    //AGARRAMOS LOS DATOS DEL NAVEGADOR
    const { nombre, apellido, password, email } = req.body;
    const error = [];
    // VERIFICAMOS QUE EL CAMPO USUARIO NO ESTE VASIO
    if (nombre.length <= 0) {
        error.push('Campo Nombre es requerido!');
        console.log(error);
    }
 
    else if (email.length <= 0) {
        error.push('Campo Email es requerido!');
        console.log(error);
    }

    //VERIFICAMOS QUE LA CONTRASEÑA SEA MAYOR A 4 DIGITOS 
    else if (password.length < 4) {
        error.push('La contraseña debe tener almenos 4 digitos!');
    }
    // SI EL ARREGLO DE ERRORES ESTA LLENO PS EXPLOTA  
    if (error.length > 0) {
        res.render('users/signup', {
            error,
            nombre,
            apellido,
            password,

        });
    }

    else {
        //VERIFICAMOS QUE EL IMAIL INGRESADO NO ESTE EN LA BASE DE DTOS 
        const UsuarioUser = await User.findOne({ email: email });
        if (UsuarioUser) {
            console.log('usuario existe')
            res.render('users/signup', { error, nombre, apellido });

        } else {
            var estado = 'activo';
            var rol = 'usuario';
            const countUser = await User.find().count();
            var secuencia = countUser + 1;
            const userRegistradoSuccess = 'El usuario se ha registrado con exito!';
            //SI EL IMAIL NO ESTA EN LA BASES DE DATOS PROCEDEREMOS A GUARDAR LOS DATOS 
            const passwordshow = password;
            const newUser = new User({ nombre, apellido, password, email, estado, rol, secuencia, passwordshow });
            // LE PASAMOS LA CONTRASEÑA A ;A FUNCION PARA QUE LA ENCRITE
            newUser.password = await newUser.encryptPassword(password);
            //AHORA SI GUARDAMOS 
            await newUser.save();
            res.render('users/signin', { userRegistradoSuccess });
        }
    }

});
router.get('/users/confirs', (req, res) => {
    res.render('users/confirs');
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