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
            console.log(err.message)
        })
});

module.exports = router;
