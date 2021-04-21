
exports.userSignUpValidator = (req,res,next ) => {
	req.check('name','Name is required.').notEmpty();

	req.check('email','Email is required')
	.notEmpty()
	.isLength({
		min: 4,
		max: 32
	})
	.withMessage('Email must be between 4 to 32 characters')
	.matches(/^[^\s@]+@[^\s@]+$/)
	.withMessage('Invalid Email format.')

	req.check('password','Password is required').notEmpty()
	.isLength({
		min: 4 
	})
	.withMessage('Password must be at least 4 characters')
	.matches(/\d/)
	.withMessage('Password must contain a number')

	const errors = req.validationErrors();
	if(errors){
		const firstError = errors.map(error => error.msg)[0]
		return res.status(400).json({
			error: firstError
		})
	}
	next();
}

// Category

exports.createCategoryValidator = (req,res,next ) => {
	req.check('name','Name is required.').notEmpty();

	const errors = req.validationErrors();
	if(errors){
		const firstError = errors.map(error => error.msg)[0]
		return res.status(400).json({
			error: firstError
		})
	}
	next();
}

// Brand

exports.createBrandValidator = (req,res,next ) => {
	req.check('name','Name is required.').notEmpty();

	const errors = req.validationErrors();
	if(errors){
		const firstError = errors.map(error => error.msg)[0]
		return res.status(400).json({
			error: firstError
		})
	}
	next();
}


// Product
// cannot validate product here since product use formidable.