const User = require('../models/user')
const {errorHandler} = require('../helpers/dbErrorHandler')

//@desc			Get User List
//@route		GET /api/v1/users/
//@access		Private

exports.getUsers = (req,res) => {
	User.find()
	.select("-hashed_password -salt -__v")
	.exec((err,users) => {
		if(!users || err){
			return res.status(400).json({
				error: errorHandler(err)
			})
		}
		return res.status(200).json({
			success:true,
			data: users
		})
	})
}


//@desc			Get User
//@route		GET /api/v1/users/:id
//@access		Private

exports.getUser = (req,res) => {
	const {id} = req.params
	User.findOne({_id:id})
	.select("-hashed_password -salt -__v")
	.populate({path:'history', model:"Order"})
	.exec((err,user) => {
		if(!user || err){
			return res.status(400).json({
				error: errorHandler(err)
			})
		}
		if(!user.contact_info){
			user.contact_info = {
				address: '',
				phone: '',
				zipcode: ''
			}
		}
		return res.status(200).json({
			success:true,
			data: user
		})
	})
}


//@desc			Create User
//@route		POST /api/v1/users/
//@access		Private

exports.createUser = (req,res) => {
	const user =  new User(req.body)
	user.save((err,user) => {
		if(err){
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: user,
				message: 'User created successfully!'
			})
		}
	})
}


//@desc			Update User
//@route		PUT /api/v1/users/:id
//@access		Private

exports.updateUser = (req,res) => {
	User.findOneAndUpdate({_id:req.params.id},req.body,{ new: true },(err,user) => {
		if(err){
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: user,
				message: 'User updated successfully!'
			})
		}
	})
}


//@desc			Delete User
//@route		DELETE /api/v1/users/:id
//@access		Private

exports.deleteUser = (req,res) => {
	User.findByIdAndDelete({_id:req.params.id},(err,user) => {
		if(err){
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				message: 'User deleted successfully!'
			})
		}
	})
}


//@desc			Add User Order History
//@route		PUT /api/v1/users/:id/history
//@access		Private

exports.updateOrderHistory = (req,res,next) => {
	const order = req.order
	User.findOneAndUpdate(
		{_id:order.user},
		{ $push: { history: order } },
		{safe: true, upsert: true, new : true},
		(err,user) => {
			console.log(err,user)
		if(err){
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				data: order,
				message: 'Order Created successfully!'
			})
		}
	})
}
