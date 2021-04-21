const express = require('express')
const router = express.Router()

const { createCategory,getCategories,getCategory,deleteCategory,updateCategory } = require('../controllers/category')
const {isAuth,isAdmin} = require('../middleware/auth')
const { createCategoryValidator } = require('../validators/index')

router.post('/', isAuth,isAdmin,createCategoryValidator,createCategory)
router.get('/', isAuth,getCategories)
router.get('/:id',getCategory)
router.put('/:id',isAuth,isAdmin,createCategoryValidator,updateCategory)
router.delete('/:id',isAuth,isAdmin,deleteCategory)

module.exports = router;

