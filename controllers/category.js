const Category = require('../models/category')
const {errorHandler} = require('../helpers/dbErrorHandler')
const category = require('../models/category')

exports.getCategories = (req,res) => {
	Category.find({},(err,categories) => {
		if(err){
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data:categories
			})
		}
	})
}

exports.createCategory = (req,res) => {
	const category = new Category(req.body);
	category.save((err,category) => {
		if(err){
			res.status(500).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: category,
				message: 'Category created successfully!'
			})
		}
	})
}

exports.getCategory = (req,res) => {
	Category.findById({_id: req.params.id},(err,category) => {
		if(err || !category){
			res.status(500).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: category
			})
		}
	})
}


exports.updateCategory = (req,res) => {
	Category.findOneAndUpdate({_id: req.params.id},req.body,{ new: true },(err,category) => {
		if(err){
			res.status(500).json({
				error: errorHandler(err)
			})
		}else{
			console.log(category)
			res.status(200).json({
				success:true,
				data: category,
				message: 'Category updated successfully!'
			})
		}
	})
}


exports.deleteCategory = (req,res) => {
	const {id} = req.params
	Category.findByIdAndDelete({_id: id},(err,category) => {
		if(err || !category){
			return res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			return res.status(200).json({
				success:true,
				message: 'Category Deleted Successfully...!'
			})
		}
	})
}