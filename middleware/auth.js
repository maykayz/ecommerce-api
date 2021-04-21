const jwt = require('jsonwebtoken')
const User = require('../models/user')
const expressJwt = require('express-jwt')

exports.isAuth = (req,res,next) => {
	const userToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null
	// const userToken = req.cookies.t ? req.cookies.t : null
	if(userToken && userToken != 'null'){
		jwt.verify(userToken,process.env.JWT_SECRET,(err, user) => {
			if(!user && !user._id){
				return res.status(401).json({
					error: 'Invalid Token.'
				})
			}
			User.findById({_id:user._id},(err,foundUser) => {
				if(!foundUser || err){
					foundUser = {
						id: user._id
					}
				}
				req.user = foundUser
				next();
			})
		})
	}
	else{
		return res.status(401).json({
			error: 'Token Required.'
		})
	}
}


exports.requireSignIn = expressJwt({
	secret: process.env.JWT_SECRET,
	algorithms: ['HS256'],
	requestProperty: 'auth'
})

exports.isAdmin = (req,res,next) => {
	if (req.user.role != 0){
		return res.status(403).json({
			error: 'Unauthorized Access'
		})
	}
	next();
}


exports.logData = (req,res,next) => {
	next();
}