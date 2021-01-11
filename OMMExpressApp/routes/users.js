var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken')

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

/* POST /users */
/* Register new user */
router.post('/', (req, res, next) => {
    const { name, password } = req.body;

    User.findOne({ name })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'User already exists' });

            const newUser = new User({
                name,
                password
            });

            //encrypt password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;

                    //save user to the data base
                    newUser.save()
                        .then(user => {
                            // create JWT
                            jwt.sign({
                                id: user.id
                            }, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
                                if (err) throw err;
                                res.json({
                                    token,
                                    user: {
                                        id: user.id,
                                        name: user.name
                                    }
                                });
                            })

                        })
                })
            })

        })
});

module.exports = router;