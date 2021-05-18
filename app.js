const express 			= require('express')
const app 				= express()
const mongoose 			= require('mongoose')
const morgan 			= require('morgan')
const expressValidator	= require('express-validator')
// const bodyParser 	= require('body-parser')
const cookieParser 		= require('cookie-parser')
const cors 				= require('cors')


// CONFIGS

require('dotenv').config()


// API PREFIX

const prefix = '/api/v1'


// ROUTE MODULES IMPORT

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const brandRoutes = require('./routes/brand')
const productRoutes = require('./routes/product')
const brainttreeRoutes = require('./routes/braintree')
const orderRoutes = require('./routes/order')


// DATABASE CONNECTION
const connection = "mongodb+srv://mayk:homhe5-bibkyk-dudsUb@cluster0.is6ns.mongodb.net/moony?retryWrites=true&w=majority";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));

// mongoose.connect(process.env.DATABASE,{
// 	useNewUrlParser:true,
// 	useCreateIndex: true,
// 	useUnifiedTopology: true
// }).then(() => {
// 	console.log("Mongo connected")
// })


// MIDDLEWARES

app.use(express.json()).use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(expressValidator())
var allowedOrigins = [
                      'http://localhost:3000',
                      'http://moony-ecommerce.netlify.app',
                      'http://60a3250dcfa6ee1c71b4fa91--moony-ecommerce.netlify.app',
                    ];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(cors(corsOptions));


// USE ROUTE MODULES

app.use(`${prefix}`,authRoutes)
app.use(`${prefix}/users`,userRoutes)
app.use(`${prefix}/categories`,categoryRoutes)
app.use(`${prefix}/brands`,brandRoutes)
app.use(`${prefix}/products`,productRoutes)
app.use(`${prefix}/braintree`,brainttreeRoutes)
app.use(`${prefix}/orders`,orderRoutes)


// PROCESS

const port = process.env.PORT || 8000

app.listen(port, () => {
	console.log(`Server Running on port: ${port}`)
})