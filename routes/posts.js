const express = require('express');
const router = express.Router();

//Get the form for creating a new post
router.get('/new', (req, res) => {
    res.render('new-post', {});
})

//Create a new post
router.post('/', (req, res) => {
    res.render('index', {title: 'hello'})
    console.log(req.body)
})

module.exports = router;
