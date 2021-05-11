const express = require('express')
const router = express.Router()

const {updateSoldQty} = require('../controllers/product')
const { createOrder,getOrders,getOrderById,cancelOrderById,changeOrderStatus } = require('../controllers/order')
const { updateOrderHistory } = require('../controllers/user')
const {isAuth,isAdmin} = require('../middleware/auth')
const { createOrderValidator } = require('../validators/index')

router.post('/', isAuth,createOrder,updateSoldQty,updateOrderHistory)
router.get('/', isAuth,isAdmin,getOrders)
router.get('/:id', isAuth,getOrderById)
router.get('/:id/cancel', isAuth,cancelOrderById)
router.put('/:id/status', isAuth,isAdmin,changeOrderStatus)

module.exports = router;

