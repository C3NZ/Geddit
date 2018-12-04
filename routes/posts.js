const express = require('express');
const router = express.Router();
const Post = require('../models/post');

const checkAuth = require('../lib/authorizeUser');

//Get the form for creating a new post
router.get('/new', (req, res) => {
    res.render('new-post', res.locals);
})

//GET the view for a specific post
router.get('/:postId', (req, res) => {
    Post.findOne({_id: req.params.postId}).populate('comments').then(post => {
        res.locals.post = post 
        res.render('show-post', res.locals)
    }).catch(err => {
        console.error(err);
    })
})

//POST a new post to geddit
router.post('/', (req, res) => {
    checkAuth(res.locals.user); 
    
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
