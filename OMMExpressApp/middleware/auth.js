const config = require('config');
const jwt = require('jsonwebtoken');

// middleware that can be added to any request to authenticate the user
// EXAMPLE:
// memeIO.get('/get-memes', auth, (req, res) => {

//   Meme.find({}, function(err, docs) {
//         if (err)
//             return res.status(500).send(err);

//         res.json({ code: 200, docs })
//     })

// });

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    //Check for token
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