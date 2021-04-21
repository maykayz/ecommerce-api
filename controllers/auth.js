const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {errorHandler} = require('../helpers/dbErrorHandler')


//@desc			Sign Up
//@route		POST /api/v1/users/
//@access		Private

exports.signup = (req,res) => {
	const user =  new User({
		name: req.body.name,
		password: req.body.password,
		email: req.body.email
	})
	user.save((err,user) => {
		if(err){
			console.log(err)
			res.status(400).json({
				error: errorHandler(err)
			})
		}else{
			res.status(200).json({
				success:true,
				message: 'Sign Up successfully!'
			})
		}
	})
}

exports.login = (req,res) => {

	const {email,password} = req.body

	User.findOne({email:email}, (err,user) => {
		if(err || !user){
			return res.status(400).json({
				error: 'User does not exist.'
			})
		}
		
		const {_id,name,email,role} = user;
		const token = jwt.sign({_id: _id}, process.env.JWT_SECRET)
		const isAuthenticated = user.authenticate(password)

		if(!isAuthenticated){
			return res.status(401).json({
				error: 'Email and password does not match.'
			})
		}
		else{
			const options = {expire: new Date() + 3600 * 24 * process.env.JWT_COOKIE_EXPIRE}
			// if(process.env.NODE_ENV == 'production'){
				options.httpOnly = true
			// }
			res.cookie("t",token,options)
			return res.status(200).json({
				token: token,
				user: {
					_id: _id,
					name: name,
					email: email,
					role: role
				}
			})
		}
		
	})
}


exports.logout = (req,res) => {
	res.clearCookie("t")
	res.status(200).json({
		message: "Sign out successfully"
	})
}
