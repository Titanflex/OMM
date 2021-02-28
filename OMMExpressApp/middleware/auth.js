const config = require('config');
const jwt = require('jsonwebtoken');

/**
 * Authentication MIDDLEWARE -> can be added to a request to authenticate the user
 * returns the id of the user in the body request
 */
function auth(req, res, next) {
    const token = req.header('x-auth-token');

    //Check for token -> if note deny authorization
    if (!token) return res.status(401).json({
        msg: 'No token, authorization denied'
    });

    try {
        //Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // Add user from playload
        req.user = decoded;
        next();

    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' })
    }
}

module.exports = auth;