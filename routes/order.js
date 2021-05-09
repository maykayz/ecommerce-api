const express = require('express')
const router = express.Router()

const {updateSoldQty} = require('../controllers/product')
const { createOrder,getOrders } = require('../controllers/order')
const { updateOrderHistory } = require('../controllers/user')
const {isAuth} = require('../middleware/auth')
const { createOrderValidator } = require('../validators/index')

router.post('/', isAuth,createOrder,updateSoldQty,updateOrderHistory)
router.get('/', isAuth,getOrders)

module.exports = router;

