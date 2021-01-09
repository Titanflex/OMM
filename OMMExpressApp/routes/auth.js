var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

// User Model
const User = require('../models/userSchema')

/* POST /auth */
/* Authenticate the User */
router.post('/login', (req, res, next) => {
    const { name, password } = req.body;

    User.findOne({ name })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exist' });

            //validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });
                    //create jwt
                    jwt.sign({
                        id: user.id
                    }, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
                        if (err) throw err;
                        res.json({
                            token,
                            user: {
                                id: user.id,
                                name: user.name,
                            }
                        });
                    })
                })

        })
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