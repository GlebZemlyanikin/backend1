const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants');

function auth(req, res, next) {
    const token = req.cookies.token;

    try {
        const verified = jwt.verify(token, JWT_SECRET);

        res.user = {
            email: verified.email,
        };

        next();
    } catch (e) {
        res.redirect('/login');
    }
}

module.exports = auth;
