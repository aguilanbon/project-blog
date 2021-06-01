const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = Schema({
	name   : {
		type : String
	},
	color  : {
		type : String
	},
	blogId : [
		{
			type : Schema.Types.ObjectId,
			ref  : 'Blog'
		}
	]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
