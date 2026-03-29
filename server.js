const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const connectDB = require('./server/database/connection');
const Categorydb = require('./server/model/categories');
const methodOverride = require('method-override');

dotenv.config( { path : 'config.env'} )

const app = express();
app.use(express.json());
app.use(methodOverride('_method'));
// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))
app.use(express.static(path.join(__dirname, 'public')));
console.log("TODAS LAS ENV:", process.env)
console.log("MONGO:", process.env.MONGO_URI)
console.log("DB:", process.env.DB_URI)

const PORT = process.env.PORT || 8080

// log requests
app.use(morgan('tiny'));

// mongodb connection
connectDB();

//  categorias disponibles en TODAS las vistas
app.use(async (req, res, next) => {
    try {
        const categorias = await Categorydb.find();
        res.locals.categorias = categorias; 
        next();
    } catch (error) {
        console.error(error);
        next();
    }
});


// set view engine
app.set("view engine", "ejs")
//app.set("views", path.resolve(__dirname, "views/ejs"))


// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")))
app.use('/assets', express.static(path.resolve(__dirname, "assets")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))


// load routers
app.use('/', require('./server/routes/router'))

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});
