const jwt = require('jsonwebtoken');

const createToken = (id) => {
	return jwt.sign({ id }, process.env.SECRET, { expiresIn: 900000 });
};

const extractUserId = (id) => {
	if (id === undefined) {
		return 'Guest';
	} else {
		return jwt.verify(id, process.env.SECRET);
	}
};

const isAuthUser = (uID, authorId) => {
	if (JSON.stringify(uID) === JSON.stringify(authorId)) {
		return 'Authorized';
	} else {
		return 'Unauthorized';
	}
};

module.exports = { createToken, extractUserId, isAuthUser };
