const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const User = require('../models/usuarios');
const Publicaciones = require('../models/inmueble');
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
router.post('/users/signinGoogle', passport.authenticate('local', {
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

        req.session.user = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture
        }


        const nombre = payload.name
        const email = payload.email
        const photo = payload.picture
        const estado = 'activo'
        const findUser = await User.find({ estado: 'activo' }).count()
        const secuencia = findUser + 1

        const findEmail = await User.findOne({ email: email })
        if (!findEmail) {
            const newUser = new User({ nombre, email, photo, estado, secuencia })
            await newUser.save()
            const deviceInfo = {
                browser: req.useragent.browser,
                version: req.useragent.version,
                os: req.useragent.os,
                platform: req.useragent.platform,
                device: req.useragent.isMobile ? 'Móvil' : req.useragent.isDesktop ? 'PC' : 'Desconocido'
            };
          const platform = deviceInfo.platform
          const device = deviceInfo.device  
    
            contentHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
       <h2 style="color: #4CAF50;">¡Inicio de sesión exitoso en FindMyHouse! 🏡</h2>
       <p>Hola,</p>
       <p>Has iniciado sesión en tu cuenta de <strong>FindMyHouse</strong>. Aquí tienes los detalles de acceso:</p>
       <ul style="background: #f9f9f9; padding: 15px; border-radius: 5px; list-style: none;">
           <li><strong>📅 Fecha:</strong> ${new Date().toLocaleString()}</li>
           <li><strong>📍 Plataforma:</strong> ${platform}}</li>
           <li><strong>🖥 Dispositivo:</strong> ${device}}</li>
       </ul>
       <p>Si fuiste tú, no necesitas hacer nada. Pero si no reconoces esta actividad, te recomendamos:</p>
       <ul>
           <li>⚠️ Cambiar tu contraseña inmediatamente.</li>
           <li>🚨 Activar la verificación en dos pasos (si está disponible).</li>
           <li>📧 Contactarnos en <a href="mailto:soporte@findmyhouse.com">soporte@findmyhouse.com</a> si necesitas ayuda.</li>
       </ul>
       <p>Gracias por confiar en FindMyHouse.</p>
       <hr>
       <p style="text-align: center; font-size: 12px; color: #888;">Este es un mensaje automático, por favor no respondas.</p>
    </div>
          `
           var transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               service: 'gmail',
               auth: {
                   user: 'findmyhouse57@gmail.com',
                   pass: 'mktoxcekrsrceebl'
               }
           });
           var mailOptions = {
               from: '"FindMyHouse" <findmyhouse57@gmail.com>',
               to: email,
               subject: 'Iniciaste seccion en FindMyHouse!',
               html: contentHTML,
           };
           transporter.sendMail(mailOptions, function (error, info) {
               if (error) {
                   var error = 'Error al enviar el email.. Intentalo nuevamente'
                   console.log(error)
                   res.render('users/signup', { error })
               } else {
                   var message = 'Correo enviado'
                   console.log('email enviado:' + info.response);
                   res.render('users/signup', { message })
               }
           });
    
          
        }

        let IniciarSession = true
        res.render('users/signin', { email, IniciarSession })
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

router.post('/users/changePerfil', async (req, res) => {
    const photo = req.file.filename
    const idUser = req.user.id
    const nombre = req.user.nombre + ' ' + req.user.apellido
    await User.findByIdAndUpdate(idUser, { photo });

    const publicaciones = await Publicaciones.find({ idUsuario: idUser })


    for (var i = 0; i < publicaciones.length; i++) {
        const ids = publicaciones[i].id;
        await Publicaciones.findByIdAndUpdate(ids, { photo })
    }


    res.json({ imagenName: photo, nombre: nombre })

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
    else if (apellido.length <= 0) {
        error.push('Campo Apellido es requerido!');
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
router.post('/users/confirs', async (req, res) => {
    const { AleatorioOne, AleatorioTwo, AleatorioThree, AleatorioFowr } = req.body;
    const { usuario, email, password } = req.body;
    const userRegistradoSuccess = 'El usuario se ha registrado con exito!';

    if (AleatorioONE == AleatorioOne && AleatorioTWO == AleatorioTwo
        && AleatorioTHREE == AleatorioThree && AleatorioFOWR == AleatorioFowr
    ) {

        //SI EL IMAIL NO ESTA EN LA BASES DE DATOS PROCEDEREMOS A GUARDAR LOS DATOS 
        const newUser = new User({ usuario, email, password });
        // LE PASAMOS LA CONTRASEÑA A ;A FUNCION PARA QUE LA ENCRITE
        newUser.password = await newUser.encryptPassword(password);

        //    jsonWebTokem
        const token = createToken(newUser._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        // res.status(201).json({ user: newUser._id});
        //AHORA SI GUARDAMOS 
        await newUser.save();
        res.render('users/signin', { userRegistradoSuccess });
    } else {
        console.log('Codigo no es correcto');
        res.render('users/confirs');
    }



});

router.get('/users/perfil', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id // ID del usuario que estás buscando
        const publicaciones = await Publicaciones.find({ estado: 'activa', idUsuario: userId })
        const publicacionesDeUsuario = await Publicaciones.find({
            saveUser: {
                $elemMatch: { idUser: userId }
            }
        });

  

        res.render('users/perfil', { publicaciones, publicacionesDeUsuario })

    } catch (error) {
        res.render('index')

    }

});
router.post('/users/edit', async (req, res) => {
    const { nombre, apellido, email, telefono, password } = req.body;
    if (nombre == '') {
        console.log('campo obligatorio')
    } else {
        await User.findByIdAndUpdate(req.user.id, { nombre, telefono, apellido, email });
        res.redirect('/users/perfil');

    }
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