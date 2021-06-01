const Blog = require('../models/Blog');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
	try {
		await jwt.verify(req.cookies.jwt, process.env.SECRET);
		next();
	} catch (error) {
		console.log('Unauthorized, Please Sign in');
		console.log(error);
		res.redirect('/user/signin');
	}
};

const isAuthorized = async (req, res, next) => {
	const blogId = req.params.id;
	const user = await jwt.verify(req.cookies.jwt, process.env.SECRET);
	try {
		const blogData = await Blog.findById(blogId);
		if (toString(user.id) === toString(blogData.author)) {
			next();
		} else {
			console.log('Unauthorized');
			res.redirect('back');
		}
	} catch (error) {
		console.log(error);
	}
};

module.exports = { isLoggedIn, isAuthorized };
