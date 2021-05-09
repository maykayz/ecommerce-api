const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const CartItem = new mongoose.Schema(
  {
    product: { type: ObjectId, ref: "Product" },
    name: String,
    price: Number,
	  discount_price: Number,
    count: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("CartItem",CartItem)