const express = require('express');
const router = express.Router();
const Post = require('../models/post') 

/* GET home page. */
router.get('/', function(req, res, next) {
    Post.find()
        .then(posts => {
            res.locals.posts = posts
            res.render('index', res.locals)
        })
        .catch(err => {
            console.error(err.message)
        })
});

/* GET a specific subreddit */
router.get('/c/:subreddit', (req, res) => {
    Post.find({subreddit: req.params.subreddit})
        .then(posts => {
            res.locals.posts = posts
            res.render('index', res.locals)
        })
        .catch(err => {
            console.error(err)
        })
})

router.get('/admin', (req, res) => {
    console.log(res.locals.user.payload.type)
    if (res.locals.user.payload.type === 'user') {
        res.status(401).send('Hey, youre not an admin!!!')
    } else {
        res.status(200).send("hey, youre an admin!")
    }
})

module.exports = router;
