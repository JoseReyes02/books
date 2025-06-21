
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const passport = require('passport')
const multer = require('multer');



const { Server } = require('socket.io');
const http = require('http');


//inicializaciones 
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);


app.use(express.json());

require('./database');
require('./config/passport');
require('./config/passportGoogle');
const configSockets = require('./helpers/sockets');
// app.use(cookies());
configSockets(io)
io.on('connection', (socket) => {
})

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/upload'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombreSeguro = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '');
    cb(null, nombreSeguro);
  }
})

//settings
app.set('port', process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// 🔥 Desactivar caché de vistas 🔥
// app.set('view cache', false);

//Stati file
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(multer({
  storage,
  dest: path.join(__dirname, 'public/upload'),
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|avif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("El archivo debe ser una imagen valida");
  }
}).array('image', 10));

// variables globales
app.use((req, res, next) => {
  res.locals.user = req.user || null
  next();
})



// rutas

app.use(require('./routes/index'));
app.use(require('./routes/publicaciones'));
app.use(require('./routes/users'));
app.use(require('./routes/dasboard'));
app.use(require('./routes/admin'));






app.use(express.static(path.join(__dirname, 'public')));


httpServer.listen(app.get('port'), () => {
  console.log("El servidor esta activo!", app.get('port'));
})
