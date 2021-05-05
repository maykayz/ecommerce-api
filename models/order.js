const mongoose = require('mongoose')
const {timeStamp} = require('console')
const {ObjectId} = mongoose.Schema

const CartItem = new mongoose.Schema(
	{
	  _id: { type: ObjectId, ref: "Product" },
	  name: String,
	  price: Number,
	  discount_price: Number,
	  count: Number
	},
	{ timestamps: true }
  );

const order = mongoose.Schema({
	items: [CartItem],
	user: {
		type: ObjectId,
		ref: 'User',
		required: true
	},
	shippingAddress: {
		type: String,
		required: true,
		maxlength: 2000,
		trim: true
	},
	status: {
		type: String,
		default: "New",
		enum: ["New", "Processing", "Shipped", "Delivered", "Cancelled"]
	},
	transaction_id: {},
	transaction_amount: {
		type: Number,
		default: 0
	},
	discount: {
		type: Number,
		default: 0
	},
	subtotal: {
		type: Number,
		default: 0
	},
	shipping_fees: {
		type: Number,
		default: 0
	},
	total: {
		type: Number,
		default: 0
	},
	remaining_balance: {
		type: Number,
		default: 0
	},
	cancel_reason: String,
	estimated_delivery_date: Date,
	updated: Date,
},{timestamps: true})

module.exports = mongoose.model("Order",order)