const Brand = require('../models/brand')
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.getBrands = (req,res) => {
	Brand.find({},(err,brands) => {
		if(err){
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: brands
			})
		}
	})
}

exports.getBrand = (req,res) => {
	Brand.findById({_id: req.params.id},(err,brand) => {
		if(err){
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: brand
			})
		}
	})
}

exports.createBrand = (req,res) => {
	const brand = new Brand(req.body);
	brand.save((err,brand) => {
		if(err){
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: brand,
				message: 'Brand created successfully!'
			})
		}
	})
}


exports.updateBrand = (req,res) => {
	Brand.findOneAndUpdate({_id:req.params.id},req.body,{ new: true },(err,brand) => {
		if(err){
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: brand,
				message: 'Brand Updated successfully!'
			})
		}
	})
}

exports.deleteBrand = (req,res) => {
	const {id} = req.params
	Brand.findByIdAndDelete({_id: id},(err,brand) => {
		if(err || !brand){
			return res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			return res.status(200).json({
				success:true,
				message: 'Brand Deleted Successfully...!'
			})
		}
	})
}