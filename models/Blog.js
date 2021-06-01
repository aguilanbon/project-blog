const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema(
	{
		title    : {
			type     : String,
			required : true
		},
		snippet  : {
			type     : String,
			required : true
		},
		category : [
			{
				type : Schema.Types.ObjectId,
				ref  : 'Category'
			}
		],
		content  : {
			type     : String,
			required : true
		},
		upVotes  : {
			type    : Number,
			default : 0
		},
		comments : [
			{
				type : Schema.Types.ObjectId,
				ref  : 'Comment'
			}
		],
		author   : {
			type : Schema.Types.ObjectId,
			ref  : 'User'
		},
		img      : {
			type : String
		}
	},
	{ timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
