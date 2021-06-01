const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const User = require('../models/User');
const dateFormat = require('dateformat');
const { extractUserId, isAuthUser } = require('../functions/functions');

const getAll = async (req, res) => {
	const userId = extractUserId(req.cookies.jwt);
	try {
		const blogData = await Blog.find().populate('category').populate('author').sort({ createdAt: -1 });
		if (userId === 'Guest') {
			res.render('index', { blogData: blogData, user: 'Guest' });
		} else {
			const userData = await User.findById({ _id: userId.id });
			res.render('index', { blogData: blogData, user: userData });
		}
	} catch (error) {
		console.log(error);
	}
};
const createBlog_get = async (req, res) => {
	const userId = extractUserId(req.cookies.jwt);
	const catData = await Category.find();
	const userData = await User.findById({ _id: userId.id });
	res.render('blog-pages/create', { user: userData, catData });
};

const createBlog_post = async (req, res) => {
	const userId = extractUserId(req.cookies.jwt);
	const { title, snippet, category, content } = req.body;
	try {
		const author = await User.findById({ _id: userId.id });
		const blogData = await Blog.create({
			title,
			snippet,
			category,
			content,
			author   : author._id
		});
		const categories = blogData.category;
		await Category.updateMany({ _id: { $in: categories } }, { $push: { blogId: blogData._id } });
		req.flash('success', 'Yayyy!!! New blog!');
		res.redirect(`/blogs/view-post/${blogData._id}`);
	} catch (error) {
		console.log(error);
	}
};

const viewPost = async (req, res) => {
	const id = req.params.id;
	const userId = extractUserId(req.cookies.jwt);
	try {
		const blogData = await Blog.findById(id)
			.populate({ path: 'comments', options: { sort: '-createdAt' }, populate: { path: 'authorId' } })
			.populate({ path: 'category', options: { sort: '-createdAt' } })
			.populate({ path: 'author' });

		const blogComments = blogData.comments;
		const blogDate = dateFormat(blogData.createdAt, 'fullDate');

		const auth = isAuthUser(userId.id, blogData.author._id);

		if (userId === 'Guest') {
			res.render('blog-pages/view-post', {
				blog         : blogData,
				blogComments : blogComments,
				user         : 'Guest',
				blogDate,
				auth
			});
		} else {
			const userData = await User.findById({ _id: userId.id });
			res.render('blog-pages/view-post', {
				blog         : blogData,
				blogComments : blogComments,
				user         : userData,
				blogDate,
				auth
			});
		}
	} catch (error) {
		console.log(error);
	}
};

const viewTags = async (req, res) => {
	const id = req.params.id;

	const blogData = await Category.findById(id);
	const blog_id = blogData.blogId;

	await Blog.find({ _id: { $in: blog_id } }).then((data) => res.send(data));
};

const deletePost = (req, res) => {
	const id = req.params.id;

	Blog.findByIdAndRemove(id).then(() => {
		res.redirect('/');
	});
};

const editPost_get = async (req, res) => {
	const id = req.params.id;

	const blogData = await Blog.findById(id)
		.populate({ path: 'comments', options: { sort: '-createdAt' } })
		.populate({ path: 'category', options: { sort: '-createdAt' } });

	const userId = extractUserId(req.cookies.jwt);
	const userData = await User.findById({ _id: userId.id });
	const category = await Category.find({});

	res.render('blog-pages/edit', { blog: blogData, user: userData, category });
};

const editPost_post = async (req, res) => {
	const id = req.params.id;

	await Blog.findByIdAndUpdate(id, {
		title   : req.body.title,
		snippet : req.body.snippet,
		content : req.body.content
	});
	res.redirect('/');
};

const addComment = async (req, res) => {
	const comment = req.body.comment;
	const id = req.params.id;
	const userId = extractUserId(req.cookies.jwt);
	try {
		if (comment.length < 6) {
			res.redirect('back');
		} else {
			const commentData = await Comment.create({ commentField: comment, authorId: userId.id });
			await Blog.findByIdAndUpdate(id, { $push: { comments: commentData._id } });
			await User.findByIdAndUpdate(userId.id, { $push: { userComments: commentData._id } });
			res.redirect('back');
		}
	} catch (error) {
		console.log(error);
	}
};

const pinPost = async (req, res) => {
	const id = req.body.id;
	await Blog.findByIdAndUpdate(id, { isPinned: true }).then(() => {
		res.redirect('/');
	});
};

const upVote = async (req, res) => {
	const id = req.params.id;
	await Blog.findByIdAndUpdate(id, { $inc: { upVotes: 1 } }).then(() => res.redirect(`/blogs/view-post/${id}`));
};

const addCategory = (req, res) => {};

module.exports = {
	getAll,
	createBlog_get,
	createBlog_post,
	viewPost,
	deletePost,
	editPost_get,
	editPost_post,
	pinPost,
	upVote,
	addComment,
	viewTags
};
