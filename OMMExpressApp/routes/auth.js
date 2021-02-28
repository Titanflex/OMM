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

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Origin, Access, Control, Allow-Headers, Authorization, Content-Type, Accept, X-Access-Token, x-auth-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/* POST /auth/login */
/* Authenticate the User by name and password*/
router.post('/login', async(req, res) => {
    const { name, password } = req.body;

    try {
        // Check if user name exists
        const user = await User.findOne({ name });
        if (!user) throw Error('User does not exist. Please Sign Up!');

        //compare the given password with the password in the db 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid password');

        //create jwt token and sign the user id to it
        const token = jwt.sign({ id: user._id }, config.get('jwtSecret'));
        if (!token) throw Error('Couldnt sign the token');

        //return the token and user as JSON
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
/* Gets the user */
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        //remove password due to security reasons
        .select('-password')
        .then(user => res.json(user));
})

/* POST /auth/register */
/* Registers a new the User */
router.post('/register', async(req, res) => {
    const { name, password } = req.body;

    try {
        //check if the username is alreay taken
        const user = await User.findOne({ name });
        if (user) throw Error('User already exists');

        //encrypt the password
        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('Something went wrong with bcrypt');
        const hash = await bcrypt.hash(password, salt);
        if (!hash) throw Error('Something went wrong hashing the password');

        const newUser = new User({
            name,
            password: hash
        });

        //save the user to the db
        const savedUser = await newUser.save();
        if (!savedUser) throw Error('Something went wrong saving the user');

        //create jwt token that lasts 24 hour and sign the user id to it
        const token = jwt.sign({ id: savedUser._id }, config.get('jwtSecret'));

        //return the token and the user as JSON
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