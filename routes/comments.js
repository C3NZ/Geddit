const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');
const Post = require('../models/post');

router.post('/:postId', (req, res) => {
    const comment = new Comment(req.body);

    comment
        .save()
        .then(comment => {
            return Post.findOne({_id: req.params.postId});
        })
        .then(post => {
            post.comments.unshift(comment);
            return post.save();
        })
        .then(post => {
            res.redirect('/')
        })
        .catch(err => {
            console.error(err)
        })
})

module.exports = router;
