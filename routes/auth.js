const express = require('express')
const router = express.Router()

const {login,logout,signup} = require('../controllers/auth')

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout',logout)

module.exports = router;

