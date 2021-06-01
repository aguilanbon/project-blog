const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	fname        : {
		type     : String,
		required : true
	},
	lname        : {
		type     : String,
		required : true
	},
	username     : {
		type      : String,
		required  : true,
		unique    : true,
		trim      : true,
		minlength : 3
	},
	password     : {
		type      : String,
		required  : true,
		minlength : 6
	},
	userPosts    : [
		{
			type : Schema.Types.ObjectId,
			ref  : 'Blog'
		}
	],
	userComments : [
		{
			type : Schema.Types.ObjectId,
			ref  : 'Comment'
		}
	],
	avatar       : {
		type : String
	}
});

userSchema.pre('save', async function(next) {
	const saltRounds = 10;
	this.password = await bcrypt.hash(this.password, saltRounds);
	next();
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
