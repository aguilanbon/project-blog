require('dotenv').config();
const { urlencoded } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

// local imports

const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const { extractUserId } = require('./functions/functions');

const app = express();

// middlewares

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
mongoose.set('useFindAndModify', false);
const sessionConfig = {
	secret            : 'dontdothiskids',
	resave            : false,
	saveUninitialized : true,
	cookie            : {
		expires  : Date.now() + 900000,
		maxAge   : 900000,
		httpOnly : true
	}
};

app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// db connection

// mongoose
// 	.connect(
// 		'mongodb+srv://aguilanbon:lnEqlK4JPne3SEOO@blog-test.tbosp.mongodb.net/simpolBlog?retryWrites=true&w=majority',
// 		{ useNewUrlParser: true, useUnifiedTopology: true }
// 	)
// 	.then(() => app.listen(3000));

const dbOptions = {
	useNewUrlParser    : true,
	useUnifiedTopology : true,
	useCreateIndex     : true
};

mongoose.connect(process.env.URI, dbOptions, () =>
	app.listen(process.env.PORT, () => console.log(`Connected to DB, Listening to PORT ${process.env.PORT}`))
);

// routes

app.get('/', (req, res) => {
	res.redirect('/blogs');
});

app.use('/blogs', blogRoutes);
app.use('/user', userRoutes);

app.use('*', async (req, res, next) => {
	const userId = extractUserId(req.cookies.jwt);
	if (userId === 'Guest') {
		res.render('error', { user: '404', user: 'Guest' });
	} else {
		const userData = await User.findById({ _id: userId.id });
		res.render('error', { user: userData });
	}
});

// app.use(err, req, res, next) => {

// }
