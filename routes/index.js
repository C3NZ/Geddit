const express = require('express');
const router = express.Router();
const Post = require('../models/post') 

/* GET home page. */
router.get('/', function(req, res, next) {
    Post.find()
        .then(posts => {
            res.render('index', {posts: posts})
        })
        .catch(err => {
            console.err(err.message)
        })
});

/* GET a specific subreddit */
router.get('/c/:subreddit', (req, res) => {
    Post.find({subreddit: req.params.subreddit})
        .then(posts => {
            res.render('index', {posts: posts})
        })
        .catch(err => {
            console.error(err)
        })
})

module.exports = router;
