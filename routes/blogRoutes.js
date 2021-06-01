const express = require('express');
const passport = require('passport');
const {
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
} = require('../controller/blogController');
const { isLoggedIn, isAuthorized } = require('../middleware/Collection');

const router = express.Router();

router.get('/', getAll);
router.get('/create', isLoggedIn, createBlog_get);
router.post('/create', isLoggedIn, createBlog_post);
router.get('/view-post/:id', viewPost);
router.get('/view-tag/:id', viewTags);
router.delete('/:id', [ isLoggedIn, isAuthorized ], deletePost);
router.get('/edit/:id', [ isLoggedIn, isAuthorized ], editPost_get);
router.post('/edit/:id', [ isLoggedIn, isAuthorized ], editPost_post);
router.post('/pin/:id', pinPost);
router.put('/upvote/:id', upVote);
router.patch('/comment-post/:id', isLoggedIn, addComment);

module.exports = router;
