const express = require('express')
const router = express.Router()

const { createOrder } = require('../controllers/order')
const {isAuth} = require('../middleware/auth')
const { createOrderValidator } = require('../validators/index')

router.post('/', isAuth,createOrder)

module.exports = router;

