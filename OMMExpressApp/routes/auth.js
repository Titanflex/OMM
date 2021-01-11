var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

// User Model
const User = require('../models/userSchema')

router.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/* POST /auth */
/* Authenticate the User */
router.post('/login', async(req, res) => {
    const { name, password } = req.body;

    try {
        // Check for existing user
        const user = await User.findOne({ name });
        if (!user) throw Error('User does not exist');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid credentials');

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
        if (!token) throw Error('Couldnt sign the token');

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});


/* Get /auth/user */
/* Get user data */
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        //remove password for security reasons
        .select('-password')
        .then(user => res.json(user));
})

module.exports = router;