const router = require('express').Router();
const { signup, signup_post, signin, signin_post, logout } = require('../controller/userController');
const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
	destination : function(req, file, cb) {
		cb(null, path.join(__dirname, '../public/images/avatar'));
	},
	filename    : function(req, file, cb) {
		cb(null, Date.now() + file.originalname);
	}
});

const upload = multer({ storage: storage });

router.get('/signup', signup);
router.post('/signup', upload.single('avatar'), signup_post);
router.get('/signin', signin);
router.post('/signin', signin_post);
router.get('/logout', logout);

module.exports = router;
