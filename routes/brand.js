const express = require('express')
const router = express.Router()

const { createBrand,getBrands, getBrand, updateBrand, deleteBrand } = require('../controllers/brand')
const {isAuth,isAdmin} = require('../middleware/auth')
const { createBrandValidator } = require('../validators/index')

router.post('/', isAuth,isAdmin,createBrandValidator,createBrand)
router.get('/',getBrands)
router.get('/:id',getBrand)
router.put('/:id',isAuth,isAdmin,createBrandValidator,updateBrand)
router.delete('/:id',isAuth,isAdmin,deleteBrand)

module.exports = router;

