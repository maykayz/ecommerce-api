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


// DATABASE CONNECTION

mongoose.connect(process.env.DATABASE,{
	useNewUrlParser:true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(() => {
	console.log("Mongo connected")
})


// MIDDLEWARES

app.use(express.json()).use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(expressValidator())
const corsOptions = {
    credentials: true,
    origin: "http://localhost:3000"
  };
app.use(cors(corsOptions));


// USE ROUTE MODULES

app.use(`${prefix}`,authRoutes)
app.use(`${prefix}/users`,userRoutes)
app.use(`${prefix}/categories`,categoryRoutes)
app.use(`${prefix}/brands`,brandRoutes)
app.use(`${prefix}/products`,productRoutes)


// PROCESS

const port = process.env.PORT || 8000

app.listen(port, () => {
	console.log(`Server Running on port: ${port}`)
})