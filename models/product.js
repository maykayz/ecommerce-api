const mongoose = require('mongoose')
const {timeStamp} = require('console')
const {ObjectId} = mongoose.Schema

const product = mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxlength: 50,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		maxlength: 2000,
		trim: true
	},
	price: {
		type: Number,
		required: true,
		trim: true
	},
	discount_price: {
		type: Number,
		trim: true,
		default: 0
	},
	category: {
		type: ObjectId,
		ref: 'Category',
		required: true
	},
	brand: {
		type: ObjectId,
		ref: 'Brand'
	},
	quantity: {
		type: Number
	},
	sold: {
		type: Number,
		default: 0
	},
	url: {
		type: String,
		default: null
	},
	photo: {
		data: Buffer,
		contentType: String
	},

},{timestamps: true})

module.exports = mongoose.model("Product",product)