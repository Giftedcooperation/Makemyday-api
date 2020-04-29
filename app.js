const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const handleValidation = require('./src/handleEmailValidation/validation')
const handleUserSignup = require('./src/handleUserSignup/signup')
const handleUserSignin = require('./src/handleSignin/handleSignin')
const handleAddProduct = require('./src/handleAddProduct/addProduct')
const handleFetchProducts = require('./src/handleFetchProducts/handleFetchProducts')
const handleUpdateEvent = require('./src/handleUpdateEvent/handleUpdateEvent')
const handleForgotPassword = require('./src/handleForgotPassword/handleForgotPassword')
const handleEditProfile = require('./src/handleEditProfile/handleEditProfile')
const handleGetUser = require('./src/handleGetUser/handleGetUser')
const handlePayment = require('./src/handlePayment/handlePayment')
const router = express.Router()
const bcrypt = require('bcryptjs')
const Product = require('./src/models/Product')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const helmet = require('helmet')
const User = require('./src/models/User')
global.Promise = mongoose.Promise
mongoose.connect(process.env.MONGODB_CONN, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
// prevent all cross site error and all web vulnurabilities
app.use(helmet())
// use router
app.use('/devapi/v1', router)
const swaggerConfig = {
  swaggerDefinition: {
    info: {
      title: 'Documentation for the server side of  Makemyday website',
      version: '1.0.0',
      contact: {
        name: 'Adewumi Sunkanmi 07031850081',
        email: 'sunkanmiadewumi1@gmail.com'
      },
      description: 'This page contains all the endpoints for the apis\' in the Makemyday serverside',
      servers: ['https://mmdapi.herokuapp.com']
    },
    schemes: ['http', 'https'],
    basePath: 'mmdapi.herokuapp.com'

  },
  apis: ['app.js']
}
const swaggerSetup = swaggerJsDoc(swaggerConfig)
// set Port
const Port = process.env.PORT || 5000
app.listen(Port, () => {
  console.log('listening to port ' + Port)
})
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup))
router.get('/', (req, res) => {
  res.send('server is listening')
})

// this router will handle my the validation of an email
/**
 * @swagger
 * /devapi/v1/validate-email/:id :
 *  get:
 *    tags:
 *       - Validation of email
 *    parameters:
 *       - name : id
 *         required : true
 *         description: this is the id of the user passed from the client
 *    description:
 *       - This request will handle the validation of an email
 *    responses:
 *       '200' :
 *           description: if the whole process is successful,it returns an html page saying verification successful
 *           content:
 *               application/json
 *       '400' :
 *           description: this will constain an error object
 *
 */
router.get('/validate-email/:id', (req, res) => {
  handleValidation(req, res, User)
})
// this router will handle the user signup
/**
 * @swagger
 * /devapi/v1/signup :
 *  post:
 *    tags:
 *       - Handle user signup
 *    description:
 *       - This endpoint will handle the signin up of users
 *
 *    responses:
 *       '201' :
 *           description: if the whole process is successful,it returns { isAvailable=> true, message=> 'A message has been sent to your email, please check it out to validate your email account' }
 *           content:
 *               application/json
 *       '400' :
 *           description: if the email entered has been used, it returns { error => 'Email has been used by someone else or you, try to login' }
 *       '500' :
 *           description: if there was an error during the proccess, it returns { error => 'Could not send mail check network connection' }
 *
 */
router.post('/signup', (req, res) => {
  handleUserSignup(req, res, User)
})
// this router will handle the user signin
/**
 * @swagger
 * /devapi/v1/signin :
 *  post:
 *    tags:
 *       - Handle user signin
 *    description:
 *       - This endpoint will handle the signing in of users
 *    responses:
 *       '201' :
 *           description: >
 *                             if the whole process is successful,it returns
 *           content:
 *               application/json
 *       '400' :
 *
 *            description :  this will return an error message if any of the login requirement is not met
 *
 *       '500' :
 *           description: if there was an error during the proccess, it returns { error => 'Could not send mail check network connection' }
 *
 */
router.post('/signin', (req, res) => {
  handleUserSignin(req, res, User)
})
/**
 * @swagger
 * /devapi/v1/addPrdoduct :
 *  post:
 *    tags:
 *       - Handle adding of item to database
 *    description:
 *       - This endpoint will handle the insertion of data to database
 *    responses:
 *       '201' :
 *           description: if the whole process is successful,it returns an object of the item added
 *           content:
 *               application/json
 *       '500' :
 *           description: if there was an error during the proccess, it returns the error message
 *
 */
// this router will handle the adding of products
router.post('/addProduct', (req, res) => {
  handleAddProduct(req, res, Product)
})
// this router will handle the fetching of allproduct from the database
/**
 * @swagger
 * /devapi/v1/getProducts :
 *  get:
 *    tags:
 *       - Handle fetching of all products from the database
 *    description:
 *       - This endpoint will handle fetching of product
 *    responses:
 *       '201' :
 *           description: if the whole process is successful,it returns an arrayof all products object
 *           content:
 *               application/json
 *       '500' :
 *           description: if there was an error during the proccess, it returns the error message
 *
 */
router.get('/getProducts', (req, res) => {
  handleFetchProducts(req, res, Product)
})
/**
 * @swagger
 * /devapi/v1/handleItem/:id :
 *  patch:
 *    tags:
 *       - Handle sceduling of new event schedule
 *    description:
 *       - This endpoint will handle  event schedule for users
 *    parameters:
 *       - name : id
 *         required : true
 *         description: this is the id of the user passed from the client
 *    responses:
 *       '201' :
 *           description: if the whole process is successful,it returns an object containing updated info
 *           content:
 *               application/json
 *       '500' :
 *           description: if there was an error during the proccess, it returns the error message
 *
 */
// this router will handle the scheduling of event

router.post('/handleItem/:id', (req, res) => {
  handleUpdateEvent(req, res, User)
})
// this outer will handle the forgot password request
/**
 * @swagger
 * /devapi/v1/forgot :
 *  post:
 *    tags:
 *       - Handle users who forgot password
 *    description:
 *       - This endpoint will handle request for forgotten password
 *    responses:
 *       '200' :
 *           description: if the whole process is successful,it sends a message to the users email and returns an object for success message
 *           content:
 *               application/json
 *       '500' :
 *           description: if there was an error during the proccess, it returns the error message
 *
 */
router.post('/forgot', (req, res, next) => {
  handleForgotPassword(req, res, User, bcrypt)
})
// this router will handle the editing of a user profile
/**
 * @swagger
 * /devapi/v1/edit :
 *  patch:
 *    tags:
 *       - Handle editing of profile
 *    description:
 *       - This endpoint will handle request for updating profile
 *    responses:
 *       '200' :
 *           description: if the whole process is successful,it returns an object containing the updated info
 *           content:
 *               application/json
 *       '500' :
 *           description: if there was an error during the proccess, it returns the error message
 *
 */
router.post('/edit', (req, res) => {
  handleEditProfile(req, res, User)
})
// this router will handle the fetching of a particular user
/**
 * @swagger
 * /devapi/v1/getUser/:id :
 *  get:
 *    tags:
 *       - Handle fetching a particular user
 *    description:
 *       - This endpoint will handle fetching a user from database
 *    parameters:
 *       - name : id
 *         required : true
 *         description: this is the id of the user passed from the client
 *    responses:
 *       '200' :
 *           description: if the whole process is successful,it returns an object containing the fetched user
 *           content:
 *               application/json
 *       '500' :
 *           description: if there was an error during the proccess, it returns the error message
 *
 */
router.get('/getUser/:id', (req, res) => {
  handleGetUser(req, res, User)
})
// this router will handle the making of a payment
/**
 * @swagger
 * /devapi/v1/makePayment :
 *  post:
 *    tags:
 *       - Handle  payment for users
 *    description:
 *       - This endpoint will handle payment by users
 *    responses:
 *       '201' :
 *           description: if the whole process is successful,it returns an object containing the payment page url
 *           content:
 *               application/json
 *       '500' :
 *           description: if there was an error during the proccess, it returns the error message
 *
 */
router.post('/makePayment', (req, res) => {
  handlePayment(req, res, User, uuidv4)
})

module.exports = app
