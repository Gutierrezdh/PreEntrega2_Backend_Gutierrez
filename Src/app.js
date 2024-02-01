const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileStore = require('session-file-store');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const handlebars = require('express-handlebars');
const path = require('path');
const viewsRouter = require('./routes/views.route.js');
const { dirName } = require('./utils.js');
const ProductManager = require('./productManager');
const MongoStore = require('connect-mongo');
const loginRouter = require('./routes/login.routes.js');
const signupRouter = require('./routes/signup.routes.js');
const sessionRouter = require('./routes/session.routes.js');


const fileStorage = fileStore(session);
const app = express();
const PORT = 8080;
const server = http.createServer(app);
const socketServer = socketIO(server);
const productManager = new ProductManager();
app.use(cookieParser());
app.use(session({
    store:MongoStore.create({
        mongoUrl: 'mongodb+srv://CoderUser:1234@cluster0.vllinqm.mongodb.net/coder?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true },
        ttl:600,
}),
    secret: 'coderhouse',
    resave: false,
    saveUninitialized: false,
}))

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