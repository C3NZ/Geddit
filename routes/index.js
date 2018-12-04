const express = require('express');
const Post = require('../models/post');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    Post.find()
        .then((posts) => {
            res.locals.posts = posts;
            return res.render('index', res.locals);
        })
        .catch((err) => { res.status(501).send(err.message); });
});

/* GET a specific subreddit */
router.get('/c/:subreddit', (req, res) => {
    Post.find({ subreddit: req.params.subreddit })
        .then((posts) => {
            res.locals.posts = posts;
            return res.render('index', res.locals);
        })
        .catch((err) => { res.status(501).send(err.message); });
});

module.exports = router;
