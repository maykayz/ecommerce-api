const  formidable  = require('formidable');
const _ = require('lodash')
const fs = require('fs')

const Product = require('../models/product')
const {errorHandler} = require('../helpers/dbErrorHandler');
const e = require('express');


//@desc			Get All Products
//@route		GET /api/v1/products
//@access		Public
//@query		sortBy,orderBy,limit		

exports.getProducts = (req,res) => {
	
	let sort = req.query && req.query.sortBy ? req.query.sortBy : 'createdAt'
	let order = req.query && req.query.orderBy ? req.query.orderBy : 'desc'
	let limit = req.query && req.query.limit ? parseInt(req.query.limit) : 10
	let page = req.query && req.query. page ?  parseInt(req.query.page) : 1
	let skip = page > 1 ? (page-1) * limit : 0
	let total = 0;
	let total_page = 0

	Product.count({},(err,count) => {
		total = count
		total_page = Math.ceil(total/limit)
	});	

	Product.find() 
	//.select("-photo")
	.populate("category")
	.populate("brand")
	.sort([[sort,order]])
	.limit(limit)
	.skip(skip)
	.exec((err,products) => {
		if(err || !products){
			return res.status(400).json({
				error: errorHandler(err)
			})
		}
		else{
			products.forEach(item => {
				if(item.photo.data){
					item.url = `${process.env.SERVER}${req.baseUrl}/${item._id}/photo`
					item.photo = undefined
				}
			})
			res.status(200).json({
				success:true,
				currentPage: page,
				total: total,
				totalPage: total_page,
				data: products
			})
		}
	})

}


//@desc			Get Related Product By Product ID
//@route		GET /api/v1/products/related/:product_id
//@access		Public

exports.getRelatedProducts = (req,res) => {
	
	let {id} = req.params
	let category = req.product.category ? req.product.category : ''
	let sort = req.query.sortBy ? req.query.sortBy : 'quantity'
	let order = req.query.orderBy ? req.query.orderBy : 'asc'
	let limit = req.query.limit ? parseInt(req.query.limit) : '10'

	Product.find({_id:{$ne:id},category:category._id})
	.populate("category")
	.populate("brand")
	.sort([[sort,order]])
	.exec((err,products) => {
		if(err || !products){
			return res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			products.forEach(item => {
				if(item.photo.data){
					item.url = `${process.env.SERVER}${req.baseUrl}/${item._id}/photo`
					item.photo = undefined
				}
			})
			return res.status(200).json({
				success:true,
				total: products.length,
				data: products
			})
		}
	})
}


//@desc			Get Product By ID
//@route		GET /api/v1/products/:id
//@access		Public

exports.getProductById = (req,res,next) => {

	Product.findOne({_id:req.params.id})
	.populate("category","_id name")
	.populate("brand","_id name")
	.exec((err,product) => {
		if(!product || err){
			return res.status(400).json({
				error: err ? errorHandler(err) : 'Product Not Found'
			})
		}else{
			req.product = product
			next()
		}
	})

}

//@desc			Get Product Photo
//@route		GET /api/v1/products/:id/photo
//@access		Public

exports.showPhoto = (req,res,next) => {
	if(req.product.photo.data){
		res.set('Content-Type',req.product.photo.contentType)
		return res.send(req.product.photo.data)
	}
	return res.status(400).json({
		success:false,
		message: 'Image not found'
	})
}

exports.showProduct = (req,res) => {
	if(!req.product){
		return res.status(400).json({
			error: 'Product Not Found'
		})
	}
	if(req.product.photo.data){
		req.product.photo = undefined
		req.product.url = `${process.env.SERVER}${req.baseUrl}/${req.product._id}/photo`
	}
	return res.status(200).json({
		success:true,
		data: req.product
	})
}


//@desc			Create Product
//@route		POST /api/v1/products/
//@access		Private

exports.createProduct = (req,res) => {
	let form = new formidable.IncomingForm({
		keepExtensions: true
	});
	form.parse(req, (err,fields,files) => {
		
		if(err){

			return res.status(400).json({
				error: "Image could not be uploaded"
			})

		}else{

			const {name, description, price, quantity, category, brand} = fields
			
			if(!name || !description || !price || !quantity || !category || !brand){
				return res.status(400).json({
					error: 'Please fill all fields'
				})
			}

			let product = new Product(fields)
			
			if(files.photo){
				product.photo.data = fs.readFileSync(files.photo.path)
				product.photo.contentType = files.photo.type
				if(files.photo.size > 1000000){
					return res.status(400).json({
							error: 'File size exceeds 1MB'
						})
				}
			}

			product.save((productSaveErr,result) => {
				if(productSaveErr){
					return res.status(400).json({
						error: errorHandler(productSaveErr)
					})
				}else{
					return res.status(200).json({
						success:true,
						data: result,
						message: 'Product created successfully!'
					})
				}
			})

		}
	})
}


//@desc			Update Product
//@route		POST /api/v1/products/:id
//@access		Private

exports.updateProduct = (req,res) => {
	const {id} = req.params
	let form = new formidable.IncomingForm({
		keepExtensions: true
	});

	form.parse(req, (err,fields,files) => {
		if(err){
			return res.status(400).json({
				error: "Image could not be uploaded"
			})
		}else{
			// const {name, description, price, quantity, category, brand} = fields
			// if(!name || !description || !price || !quantity || !category || !brand){
			// 	return res.status(400).json({
			// 		error: 'Please fill all fields'
			// 	})
			// }
			
			let product = new Product(fields)
			product = _.extend(product, fields);
			product._id = id
			product.url = null
			if(files.photo){
				product.photo.data = fs.readFileSync(files.photo.path)
				product.photo.contentType = files.photo.type
				if(files.photo.size > 1000000){
					return res.status(400).json({
							error: 'File size exceeds 1MB'
						})
				}
			}

			Product.findOneAndUpdate({_id:req.params.id},product,{
				// useFindAndModify: false
				new: true
			},(err,result) => {
				if(err){
					return res.status(400).json({
						error: 'Error Updating Product'
					})
				}else{
					result.photo = undefined
					return res.status(200).json({
						success:true,
						data: result,
						message: 'Product Updated Successfully...!'
					})
				}
			})
		}
	})
}

//@desc			Update Product
//@route		POST /api/v1/products/:id
//@access		Private

exports.updateSoldQty = (req,res,next) => {
	var bulkOps = req.order.items.map(item => {
		return {
			 updateOne : {
				"filter" : { "_id" : item._id },
				"update" : { 
					$inc: {
						sold: +item.count,
						quantity: -item.count
					} 
				}
			 } ,
		}
	})
	
	Product.bulkWrite(bulkOps,{}, (err,result) => {
		if(err){
			return res.status(400).json({
				error: 'Error Updating Quantity'
			})
		}else{
			next()
		}
	})
}



//@desc			Delete Product
//@route		DELETE /api/v1/products/:id
//@access		Private

exports.deleteProduct = (req,res) => {
	const {id} = req.params
	Product.findByIdAndDelete({_id: id},(err,product) => {
		if(err || !product){
			return res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			return res.status(200).json({
				success:true,
				message: 'Product Deleted Successfully...!'
			})
		}
	})
}


//@desc			Create Categories that are used by Products
//@route		GET /api/v1/products/categories
//@access		Public

exports.getCategoriesWithProducts = (req,res) => {

	Product.distinct("category",{},(err,categories) => {
		if(err || !categories){
			return res.status(400).json({
				error: "Products not found"
			})
		}
		res.status(200).json({
			success:true,
			total: categories.length,
			data: categories
		})
	})

}


//@desc			Product Search List
//@route		GET /api/v1/products/search
//@access		Public
//@query		order,sortBy,limit,name,min,max

exports.listBySearch = (req, res) => {
	
    let order 	= req.body.filters.order 	? req.body.filters.order 			: "desc";
    let sortBy 	= req.body.filters.sortBy 	? req.body.filters.sortBy 			: "createdAt";
    let limit 	= req.body.filters.limit 	? parseInt(req.body.filters.limit) 	: 100;
	let page 	= req.body.filters.currentPage 	? parseInt(req.body.filters.currentPage) 	: 1;
	let row 	= req.body.filters.row 	? parseInt(req.body.filters.row) 	: 10;

	let skip = page > 1 ? (page-1) * limit : 0
	let total = 0;
	let total_page = 0;

    let findArgs = {
	};

	Object.keys(req.body.filters).forEach(key => {
			if(key !== "price" && key !== "keyword" && key !== "order" && key !== "orderBy" && key !== "currentPage" && key !== "sortBy" && key !== "limit" && key !== "skip" && key !== "page" && key !== "row"){
				if(req.body.filters[key].length > 0){
					findArgs[key] = []
					req.body.filters[key].forEach(item => {
						findArgs[key].push({_id: item})
					})
				}

			}
			if(key === "price" && req.body.filters[key].length){
				const value = req.body.filters[key].split(',')
				if(value.length){
					let price = {}
					if (value[0]) price.$gte = parseInt(value[0])
					if (value[1]) price.$lte = parseInt(value[1])
					if (price) findArgs.price = price
				}
			}
			if(key === "keyword"){
				findArgs.name = {
					$regex: req.body.filters.keyword,
					$options: 'i'
				}
			}
	})

		Product.count({},(err,count) => {
			total = count
			total_page = Math.ceil(total/limit)
		});	

		Product.find(findArgs)
        .populate("category","_id name")
		.populate("brand","_id name")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, products) => {
			if(err || !products){
				return res.status(400).json({
					error: errorHandler(err)
				})
			}
			else{
				products.forEach(item => {
					if(item.photo.data){
						item.photo = undefined
						item.url = `${process.env.SERVER}${req.baseUrl}/${item._id}/photo`
					}
				})
				res.status(200).json({
					success:true,
					currentPage: page,
					total: total,
					totalPage: total_page,
					data: products
				})
			}
        });

};