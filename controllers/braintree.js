
const braintree = require('braintree')
require('dotenv').config()


const gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: process.env.BRAINTREE_MERCHANT_ID,
	publicKey: process.env.BRAINTREE_PUBLIC_KEY,
	privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

//@desc			Get Braintree client token
//@route		GET /api/v1/braintree/getClientToken/:id
//@access		Private (User, logged In)
//@query				

exports.getClientToken = (req,res) => {
	const user = req.user
	console.log(user)
	gateway.clientToken.generate({},function (err,token){
		if(err){
			console.log(err)
			return res.status(500).json({
				error: err ? JSON.stringify(err): 'Cannot Generate Client Token.'
			})
		}else{
			res.status(200).json({
				success:true,
				clientToken: token
			})
		}
	})
}