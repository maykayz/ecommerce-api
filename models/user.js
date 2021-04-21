
const mongoose = require('mongoose')
const crypto = require('crypto')
const uuid = require('uuid')
const {timeStamp} = require('console')

const user = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		maxlength: 32
	},
	email: {
		type: String,
		trim: true,
		required: true,
		unique: true
	},
	hashed_password: {
		type: String,
		required: true,
	},
	salt: String,
	role: {
		type: Number,
		default: 1
	},
	history: {
		type: Array,
		default: []
	}
},{timestamps: true})

// virtual field
user.virtual('password')
.set(function(password){
	{
		this._password = password
		this.salt = uuid.v1()
		this.hashed_password = this.encryptPassword(password)
	}
})
.get(function(){
	return this._password
});

user.methods = {
	authenticate: function(plainText){
		return this.encryptPassword(plainText) === this.hashed_password;
	},
	encryptPassword: function(password){
		if(!password) return '';
		try{
			return crypto.createHmac('sha1',this.salt).update(password).digest('hex')
		}catch(err){
			return ''
		}
	}
}

module.exports = mongoose.model("User",user)