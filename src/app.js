const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const exphbs= require('express-handlebars');

//inicializando los modulos 
const app = express();
require('./databases');


//variable global 
let contador = 1;

//configuraciones 
app.set('port', process.env.PORT || 3000); //puerto
app.set('views', path.join(__dirname, 'views')); // las vistas
app.engine('.hbs', exphbs({ // motor de vistas como html 
    defaultLayout: 'main', // archivo default de layouts
    layoutsDir: path.join(app.get('views'), 'layouts'), // carpeta de los layouts
    partialsDir: path.join(app.get('views'), 'partials'), // carpeta de los partials 
    extname: 'hbs', // extencion de los archivos que va a utilizar
}));
app.set('view engine', '.hbs');

//middlewares
app.use(morgan('dev')); // muestra mensajes al servidor
app.use(express.json());
app.use(express.urlencoded({extended:false})); // esta linea nos permite recibir los datos de un formulario en formato OBJETO de javascript


const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname))
    }
});
app.use(multer({storage}).single('image')); // procesa el archivo enviado en el campo html "image"

//Routes
app.use(require('./routes'));

 module.exports = app;