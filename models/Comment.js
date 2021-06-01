const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema(
	{
		commentField : {
			type : String
		},
		authorId     : {
			type : Schema.Types.ObjectId,
			ref  : 'User'
		}
	},
	{ timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
