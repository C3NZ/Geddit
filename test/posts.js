const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../app')
const Post = require('../models/post');

const samplePost = {
    title: 'post title',
    url: 'http://www.google.com',
    summary: 'A stupid post'
}

describe('Posts', () => {
    before(function() {

    });

    after(function() {
        Post.findOneAndDelete(samplePost, function() {
            console.log('Deleted sample post from database')
        })

    });

    it('Should create with valid attributes at POST /posts', done => {
        Post.find(function(err, posts) {
            if(err) {
                return done(err);
            }

            let postCount = posts.length;

            chai.request(app).post('/posts').send(samplePost).then(res => {
                Post.find(function(err, posts) {
                    console.log(posts)
                    postCount.should.be.equal(posts.length - 1);
                    res.should.have.status(200);
                    return done();
                })
            }).catch(err => {
                return done(err);
            })
        })
    })
});
