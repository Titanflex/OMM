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
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Origin, Access, Control, Allow-Headers, Authorization, Content-Type, Accept, X-Access-Token, x-auth-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/* POST /auth/login */
/* Authenticate the User */
router.post('/login', async(req, res) => {
    const { name, password } = req.body;

    try {
        // Check for existing user
        const user = await User.findOne({ name });
        if (!user) throw Error('User does not exist. Please Sign Up!');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid password');

        const token = jwt.sign({ id: user._id }, config.get('jwtSecret'), { expiresIn: 3600 });
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

/* POST /register */
/* Authenticate the User */
router.post('/register', async(req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name });
        if (user) throw Error('User already exists');

        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('Something went wrong with bcrypt');

        const hash = await bcrypt.hash(password, salt);
        if (!hash) throw Error('Something went wrong hashing the password');

        const newUser = new User({
            name,
            password: hash
        });

        const savedUser = await newUser.save();
        if (!savedUser) throw Error('Something went wrong saving the user');

        const token = jwt.sign({ id: savedUser._id }, config.get('jwtSecret'), {
            expiresIn: 3600
        });

        res.status(200).json({
            token,
            user: {
                id: savedUser.id,
                name: savedUser.name,
            }
        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

module.exports = router;