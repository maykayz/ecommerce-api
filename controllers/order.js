const  formidable  = require('formidable');
const moment = require('moment')
const Order = require('../models/order')
const {errorHandler} = require('../helpers/dbErrorHandler');
const e = require('express');
const order = require('../models/order');


//@desc			Create Order
//@route		POST /api/v1/orders
//@access		Private (User)	

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



//@desc			Filter Orders
//@route		GET /api/v1/orders
//@access		Private (Admin)
//@request		sortBy,order,limit,currentpage,row,min,max,start_date,end_date


exports.getOrders = (req,res) => {

	let filters = req.query ? req.query : {}
	console.log(filters)
	let order 	= filters.order 		? filters.order 						: "desc";
    let sortBy 	= filters.sortBy 		? filters.sortBy 						: "createdAt";
    let limit 	= filters.limit 		? parseInt(filters.limit) 				: 100;
	let page 	= filters.currentPage 	? parseInt(filters.currentPage) 		: 1;
	let row 	= filters.row 			? parseInt(filters.row) 				: 10;

	let skip 		= page > 1 ? (page-1) * limit : 0
	let total 		= 0;
	let total_page 	= 0
	let findArgs 	= {
		
	}

	if(filters.status){
		findArgs.status = filters.status
	}
	if(filters.start_date || filters.end_date){
		findArgs.createdAt = {}
		if(filters.start_date){
			findArgs.createdAt.$gte = Date.parse(new Date(filters.start_date))
		}
		if(filters.end_date){
			findArgs.createdAt.$lte = Date.parse(new Date(filters.end_date))
		}
	}
	if(filters.min || filters.max){
		findArgs.total = {}
		if(filters.min){
			findArgs.total.$gte = filters.min
		}
		if(filters.max){
			findArgs.total.$lte = filters.max
		}
	}

	Order.count(findArgs,(err,count) => {
		total = count
		total_page = Math.ceil(total/limit)
	});	

	Order.find(findArgs)
	.sort([[sortBy, order]])
	.skip(skip)
	.limit(limit)
	.exec((err, orders) => {
		if(err || !orders){
			return res.status(400).json({
				error: errorHandler(err)
			})
		}
		else{
			res.status(200).json({
				success:true,
				currentPage: page,
				total: total,
				totalPage: total_page,
				data: orders
			})
		}
	});

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