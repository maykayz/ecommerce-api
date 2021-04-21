const mongoose = require('mongoose')
const {timeStamp} = require('console')

const brand = mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxlength: 50,
		trim: true,
		unique: true
	},
},{timestamps: true})

module.exports = mongoose.model("Brand",brand)