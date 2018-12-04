//import npm and std packages
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Import user model
const User = require('../models/user');

// GET the sign up form
router.get('/sign-up', (req, res) => {
    if(!res.locals.user) {
        res.render('sign-up');
    } else {
        res.redirect('')
    }
    res.render('sign-up')
})

//POST a new user and then provide a jwt to the signed up user
router.post('/sign-up', (req, res) => {
    const user = new User(req.body);
    
    user
        .save()
        .then(user => {
            //create the token and then send it to the user

            const token = jwt.sign({_id: user._id, username: user.username, type: user.type}, process.env.SECRET, {expiresIn: "60 days"});
            const maxAge = 60 * 24 * 60 * 60 * 1000;
            res.cookie('nToken', token, { maxAge: maxAge, httpOnly: true}); 
            res.redirect('/');
        })
        .catch(err => {
            console.error(err);
            return res.status(400).send({err: err});
        });
})

//GET the sign in form
router.get('/sign-in', (req, res) => {
    if (!res.locals.user) {
        res.render('sign-in')
    } else {
        res.redirect('/')
    }
})

//POST an already existing user to sign into geddit
router.post('/sign-in', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    //find the user in the databse selected by their name and password 
    User.findOne({username: username}, 'username password type')
        .then(user => {
            //Check to see if the user was found
            if (!user) {
                return res.status(401).send({message: 'Wrong username or password'})
            }
            
            //compare the users password to the one stored in db
            user.comparePassword(password, (err, isMatch) => {
                //check if an error occurred within our db 
                if (err) {
                    res.status(500).send({err: err.message});
                }
                
                //handle what happens if our passwords don't match
                if (!isMatch) {
                    return res.status(401).send({message: 'Wrong username or password'})
                }

                //Check if the user wanted their browser to be remembered
                let expireTime = "2 hours";
                if (req.body.remember) {
                    expireTime = "60 days"
                }
                
                //Create jwt token
                const token = jwt.sign({_id: user._id, username: user.username, type: user.type}, process.env.SECRET, {
                    expiresIn: expireTime 
                });
                
                //Send jwt token to the user
                const maxAge = 60 * 24 * 60 * 60 * 1000;
                res.cookie('nToken', token, {maxAge: maxAge, httpOnly: true});
                res.redirect('/');
            })
        })
        .catch(err => {
            console.error(err)
        });
});

//GET the user to sign out and then return them home
router.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
});

module.exports = router;
