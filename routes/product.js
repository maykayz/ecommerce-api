const express = require('express')
const router = express.Router()

const { createProduct,getProducts,getRelatedProducts,getProductById,showProduct,updateProduct,deleteProduct,getCategoriesWithProducts,listBySearch,showPhoto} = require('../controllers/product')
const {isAuth,isAdmin} = require('../middleware/auth')

router.get('/categories',getCategoriesWithProducts)
router.get('/related/:id',getProductById,getRelatedProducts)
router.post("/search", listBySearch);

router.post('/', isAuth,isAdmin,createProduct)
router.get('/:id',getProductById,showProduct)
router.put('/:id',isAuth,isAdmin,updateProduct)
router.delete('/:id',deleteProduct)

router.get('/:id/photo', getProductById,showPhoto)

router.get('/',getProducts) 

module.exports = router;

