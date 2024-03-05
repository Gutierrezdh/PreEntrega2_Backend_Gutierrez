const express = require('express');
const passport = require('passport');
const initializePassport = require('./config/passport.config.js');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileStore = require('session-file-store');
const productsRouter = require('./dao/routes/products.js');
const cartsRouter = require('./dao/routes/carts');
const handlebars = require('express-handlebars');
const path = require('path');
const viewsRouter = require('./dao/routes/views.route.js');
const { dirName } = require('./utils.js');
const ProductManager = require('./productManager');
const MongoStore = require('connect-mongo');
const loginRouter = require('./dao/routes/login.routes.js');
const signupRouter = require('./dao/routes/signup.routes.js');
const sessionRouter = require('./dao/routes/session.routes.js');
const dotenv = require('dotenv');
const COOKIESECRET = process.env.COOKIESECRET;

dotenv.config();

const fileStorage = fileStore(session);
const app = express();
const PORT = 8080;
const server = http.createServer(app);
const socketServer = socketIO(server);
const productManager = new ProductManager();
app.use(cookieParser());

const enviroment = async() => {
    try {
        await mongoose.connect('mongodb+srv://CoderUser:1234@cluster0.vllinqm.mongodb.net/coder?retryWrites=true&w=majority');
    } catch (error) {
        console.log(error);
    }
};

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://CoderUser:1234@cluster0.vllinqm.mongodb.net/coder?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conectado a MongoDB Atlas');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars
app.engine('handlebars', handlebars.create({ defaultLayout: 'main' }).engine);
app.set('views', path.join(dirName, 'views'));
app.set('view engine', 'handlebars');

initializePassport();
app.use(
    session({
    secret: COOKIESECRET,
    resave: false,
    saveUninitialized: true,
    })
);
app.use(passport.initialize());

// Rutas de API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

//Login routes
app.use('/', sessionRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);


socketServer.on('connection', (socket) => {
    socket.on('addProduct', async (product) => {
        console.log('Adding product:', product);
        try {
            const result = await productManager.addProduct(product);
            const allProducts = await productManager.getProducts();
            result && socketServer.emit('updateProducts', allProducts);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('deleteProduct', async (id) => {
    try {
    const result = await productManager.deleteProduct(id);
    const allProducts = await productManager.getProducts();
    result && socketServer.emit('updateProducts', allProducts);
    } catch (err) {
    console.log(err);
    }
});
});

server.listen(PORT, () => {
    console.log('El servidor está corriendo en el puerto ' + PORT);
});

module.exports = { app, server, socketServer };