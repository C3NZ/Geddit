// import dependencies
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// create express router
const router = express.Router();

// GET the sign up form
router.get('/sign-up', (req, res) => {
    if (!res.locals.user) {
        res.render('sign-up');
    } else {
        res.redirect('');
    }
});

// POST a new user and then provide a jwt to the signed up user
router.post('/sign-up', (req, res) => {
    console.log(req.body)
    const user = new User(req.body);

    user
        .save()
        .then((newUser) => {
            // create the token and then send it to the user

            const token = jwt.sign({ _id: user._id, username: user.username, type: user.type }, process.env.SECRET, { expiresIn: '60 days' });
            const maxAge = 60 * 24 * 60 * 60 * 1000;
            res.cookie('nToken', token, { maxAge, httpOnly: true });
            res.redirect('/');
        })
        .catch((err) => { res.status(400).send({ err: err.message }); });
});

// GET the sign in form
router.get('/sign-in', (req, res) => {
    if (!res.locals.user) {
        res.render('sign-in');
    } else {
        res.redirect('/');
    }
});

// POST an already existing user to sign into geddit
router.post('/sign-in', (req, res) => {
    const { username, password } = req.body;

    // find the user in the databse selected by their name and password
    User.findOne({ username }, 'username password type')
        .then((user) => {
            // Check to see if the user was found
            if (!user) {
                return res.status(401).send({ message: 'Wrong username or password' });
            }

            // compare the users password to the one stored in db
            user.comparePassword(password, (err, isMatch) => {
                // check if an error occurred within our db
                if (err) {
                    return res.status(500).send({ err: err.message });
                }

                // handle what happens if our passwords don't match
                if (!isMatch) {
                    return res.status(401).send({ message: 'Wrong username or password' });
                }

                // Check if the user wanted their browser to be remembered
                let expireTime = '2 hours';
                if (req.body.remember) {
                    expireTime = '60 days';
                }

                // Create jwt token
                const token = jwt.sign(
                    { _id: user._id, username: user.username, type: user.type },
                    process.env.SECRET,
                    { expiresIn: expireTime },
                );

                // Send jwt token to the user
                const maxAge = 60 * 24 * 60 * 60 * 1000;
                res.cookie('nToken', token, { maxAge, httpOnly: true });
                return res.redirect('/');
            });
        })
        .catch((err) => { res.status(500).send(err.message); });
});

// GET the user to sign out and then return them home
router.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
});

module.exports = router;
