// import node and std lib dependencies
const express = require('express');

// Import user and post models
const Comment = require('../models/comment');
const Post = require('../models/post');

// import checkAuth middleware
const checkAuth = require('../lib/authorizeUser');

// setup express router
const router = express.Router({ mergeParams: true });

// Make sure all users are authorized to access any route below
router.use(checkAuth);

// POST a new comment to a post and then redirect the user
router.post('/', (req, res) => {
    const comment = new Comment(req.body);
    // eslint-disable-next-line
    comment.author = res.locals.user._id;

    comment
        .save()
        .then(() => Post.findOne({ _id: req.params.postId }))
        .then((post) => {
            post.comments.unshift(comment);
            return post.save();
        })
        .then(() => { res.redirect('/'); })
        .catch((err) => { res.status(500).send(err.message); });
});

router.post('/:commentId', (req, res) => {
    Comment
        .create(req.body) 
        .then((newComment) => {
            Comment
                .findOne({ _id: req.params.commentId })
                .then((oldComment) => {
                    oldComment.replies.push(newComment._id);
                    oldComment.save();
                    res.redirect(`/posts/${req.params.postId}`)
                })
        })
    // eslint-disable-next-line
        .catch(err => res.status(500).send(err.message));
});

module.exports = router;
