const express = require('express');
const User = require('../models/user');
const Post = require('../models/post')
const router = express.Router();

/* GET users listing. */
router.get('/:username', (req, res) => {
    User
        .findOne({ username: req.params.username })
        .then((user) => {
            if (user) {
                res.locals.profile = user;
                return Post.find({ author: user._id });
            }
            return res.status(404).send('Profile was not found!');
        })
        .then((posts) => {
            res.locals.posts = posts;
            return res.render('profile', res.locals);
        })
        .catch(err => res.status(500).send(err.message));
});

module.exports = router;
