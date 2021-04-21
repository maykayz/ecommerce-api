const express = require('express')
const router = express.Router()

const { getUsers, createUser, getUser, updateUser, deleteUser} = require('../controllers/user')
const { isAuth, isAdmin } = require('../middleware/auth')
const { userSignUpValidator } = require('../validators/index')

router.put('/:id',isAuth, isAdmin, updateUser)
router.delete('/:id',isAuth,isAdmin,deleteUser)
router.get('/', isAuth,isAdmin, getUsers)
router.post('/', isAuth, isAdmin, userSignUpValidator, createUser)
router.get('/:id', getUser)

module.exports = router;