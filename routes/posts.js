/* eslint no-underscore-dangle: 0 */
// Import dependencies
const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const checkAuth = require('../lib/authorizeUser');

// Create the router
const router = express.Router();

// GET the form for creating a new post
router.get('/new', (req, res) => {
    res.render('new-post', res.locals);
});

// GET the view for a specific post
router.get('/:postId', (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate('author')
        .populate({ path: 'comments.author', model: 'User' })
        .then((post) => {
            res.locals.post = post;
            return res.render('show-post', res.locals);
        })
        .catch(err => res.status(500).send(err.message));
});

// Protect all routes under this one from being used if the user is not signed in
router.use(checkAuth);

// POST a new post to geddit
router.post('/', (req, res) => {
    const post = new Post(req.body);
    post.author = res.locals.user._id;

    post
        .save()
        .then(newPost => User.findOne({ _id: post.author }))
        .then((user) => {
            user.posts.unshift(post);
            user.save();

            return res.redirect(`/posts/${post._id}`);
        })
        .catch(err => res.status(500).send(err.message));
});

module.exports = router;
