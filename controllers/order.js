const  formidable  = require('formidable');

const Order = require('../models/order')
const {errorHandler} = require('../helpers/dbErrorHandler');
const e = require('express');


//@desc			Create Order
//@route		POST /api/v1/orders
//@access		Private (User)
//@query		sortBy,orderBy,limit		

exports.createOrder = (req,res,next) => {
	const order = new Order(req.body);
	order.save((err,order) => {
		if(err){
			res.status(500).json({
				error: errorHandler(err)
			})
		}else{
			req.order = order
			next()
		}
	})
}

exports.getOrders = (req,res) => {
	Order.find({},(err,orders) => {
		if(err){
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: orders
			})
		}
	})
}