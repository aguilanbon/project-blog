const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createToken } = require('../functions/functions');

const signup = (req, res) => {
	res.render('user-pages/register');
};

const signup_post = async (req, res) => {
	const { fname, lname, username, password } = req.body;
	console.log(req.file);
	try {
		await User.create({ fname, lname, username, password, avatar: req.file.filename }).then((data) => {
			console.log(data);
			req.flash('success', 'Account registration Successful, You may now log in.');
			res.status(200).redirect('/user/signin');
		});
	} catch (error) {
		const foundErr = error.errors.username.properties.message;
		res.render('user-pages/register', { foundErr });
	}
};

const signin = (req, res) => {
	res.render('user-pages/log-in');
};

const signin_post = async (req, res) => {
	const { username, password } = req.body;
	try {
		const foundUser = await User.findOne({ username });
		if (!foundUser) {
			req.flash('error', 'Incorrect Username / User not Found');
			res.status(400).redirect('/user/signin');
		}
		const verifyPassword = await bcrypt.compare(password, foundUser.password);
		if (!verifyPassword) {
			req.flash('error', 'Incorrect Password! Please try again.');
			res.status(400).redirect('/user/signin');
		}
		const user_token = createToken(foundUser._id);
		req.flash('success', 'Welcome Back!');
		res.cookie('jwt', user_token, { maxAge: 900000, httpOnly: true });
		res.status(200).redirect('/blogs');
	} catch (error) {
		console.log(error);
	}
};

const logout = (req, res) => {
	res.cookie('jwt', '', { maxAge: 1 });
	req.flash('success', 'Log out Successful, Comeback soon!');
	res.redirect('/blogs');
};

module.exports = { signup, signup_post, signin, signin_post, logout };
