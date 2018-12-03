const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/* GET the sign up form */
router.get('/sign-up', (req, res) => {
    res.render('sign-up')
})

/* POST a new user and then provide a jwt to the signed up user */
router.post('/sign-up', (req, res) => {
    const user = new User(req.body);

    user
        .save()
        .then(user => {
            const token = jwt.sign({_id: user._id, username: user.username}, process.env.SECRET, {expiresIn: "60 days"});
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true}) 
            res.redirect('/');
        })
        .catch(err => {
            console.error(err)
            return res.status(400).send({err: err});
        })
})

router.get('/sign-in', (req, res) => {
    res.render('sign-in')
})

router.post('/sign-in', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, 'username password')
        .then(user => {
            if (!user) {
                return res.status(401).send({message: 'Wrong username or password'})
            }

            user.comparePassword(password, (err, isMatch) => {
                if (err) {
                    res.status(500).send({err: err.message});
                }

                if (!isMatch) {
                    return res.status(401).send({message: 'Wrong username or password'})
                }

                const token = jwt.sign({_id: user._id, username: user.username}, process.env.SECRET, {
                    expiresIn: "60 days" 
                });

                res.cookie('nToken', token, {maxAge: 900000, httpOnly: true});
                res.redirect('/');
            })
        })
        .catch(err => {
            console.error(err)
        })
})

/* GET the user to sign out and then return them home */
router.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
})
module.exports = router;
