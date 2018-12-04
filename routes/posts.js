// Import dependencies
const express = require('express');
const Post = require('../models/post');
const checkAuth = require('../lib/authorizeUser');

// Create the router
const router = express.Router();


// GET the form for creating a new post
router.get('/new', (req, res) => {
    res.render('new-post', res.locals);
});

// GET the view for a specific post
router.get('/:postId', (req, res) => {
    Post.findOne({ _id: req.params.postId }).populate('comments').then((post) => {
        res.locals.post = post;
        return res.render('show-post', res.locals);
    }).catch((err) => { res.status(500).send(err.message); });
});

// Protect all routes under this one from being used if the user is not signed in
router.use(checkAuth);

// POST a new post to geddit
router.post('/', (req, res) => {
    const post = new Post(req.body);
    post.author = res.locals.user;
    post.save((err, newPost) => {
        if (err) return res.status(500).send(err.message);

        return res.redirect('/');
    });
});

module.exports = router;
