const express = require('express');
const router = express.Router();

const Post = require('../models/post');

//Get the form for creating a new post
router.get('/new', (req, res) => {
    res.render('new-post', {});
})

//Create a new post
router.post('/', (req, res) => {
    let post = new Post(req.body);
    
    post.save((err, post) => {
        console.log(err)
        console.log(post)
        return res.redirect(`/`)
    })
    
    console.log(req.body)
})

module.exports = router;
