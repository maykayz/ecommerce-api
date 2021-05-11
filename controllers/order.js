const  formidable  = require('formidable');

const Order = require('../models/order')
const {errorHandler} = require('../helpers/dbErrorHandler');
const e = require('express');
const order = require('../models/order');


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

exports.getOrderById = (req,res) => {

	Order.findOne({_id:req.params.id})
	// .populate("category","_id name")
	// .populate("brand","_id name")
	// .populate("items","_id name")
	.exec((err,order) => {
		if(!order || err){
			return res.status(400).json({
				error: err ? errorHandler(err) : 'Order Not Found'
			})
		}else{
			res.status(200).json({
				success:true,
				data: order
			})
		}
	})

}

exports.cancelOrderById = (req,res) => {
	Order.findOneAndUpdate({_id:req.params.id},{
		$set: {
			status: 'Cancel'
		}
	},(err,result) => {
		if(err){
			return res.status(400).json({
				error: 'Error Cancelling Product'
			})
		}else{
			result.photo = undefined
			return res.status(200).json({
				success:true,
				data: result,
				message: 'Product Cancelled Successfully...!'
			})
		}
	})
}

exports.updateOrderById = (req,res) => {s
	Order.findOneAndUpdate({_id:req.params.id},req.body,(err,result) => {
		if(err){
			return res.status(400).json({
				error: 'Error Updating Order'
			})
		}else{
			result.photo = undefined
			return res.status(200).json({
				success:true,
				data: result,
				message: 'Order Updated Successfully...!'
			})
		}
	})
}

exports.changeOrderStatus = (req,res) => {
	const status = req.body.status
	Order.findOneAndUpdate({_id:req.params.id},{
		$set: {
			status: status
		}
	},(err,result) => {
		if(err){
			return res.status(400).json({
				error: 'Error Changing Order'
			})
		}else{
			result.photo = undefined
			return res.status(200).json({
				success:true,
				data: result,
				message: 'Order Status Changed Successfully...!'
			})
		}
	})
}