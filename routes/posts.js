const express = require('express');
const router = express.Router();
const Post = require('../models/post');

//Get the form for creating a new post
router.get('/new', (req, res) => {
    res.render('new-post', {});
})

//GET the view for a specific post
router.get('/:postId', (req, res) => {
    Post.findOne({_id: req.params.postId}).then(post => {
        res.render('show-post', {post: post})
    }).catch(err => {
        console.error(err);
    })
})

//Create a new post
router.post('/', (req, res) => {
    let post = new Post(req.body);
    
    post.save((err, post) => {
        if(err) {
            console.error(err);
        }else{
            return res.redirect(`/`);
        }
    })
    
})

module.exports = router;
