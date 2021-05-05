const  formidable  = require('formidable');

const Order = require('../models/order')
const {errorHandler} = require('../helpers/dbErrorHandler');
const e = require('express');


//@desc			Create Order
//@route		POST /api/v1/orders
//@access		Private (User)
//@query		sortBy,orderBy,limit		

exports.createOrder = (req,res) => {
	const order = new Order(req.body);
	console.log(order)
	order.save((err,order) => {
		if(err){
			console.log(err)
			res.status(500).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: order,
				message: 'Order created successfully!'
			})
		}
	})
}