const express = require('express')
const router = express.Router()

const { getClientToken } = require('../controllers/braintree')
const {isAuth,isAdmin} = require('../middleware/auth')

router.get('/getClientToken/:id',isAuth,getClientToken)

module.exports = router;

