const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app')
const Post = require('../models/post');

const samplePost = {
    title: 'post title',
    url: 'http://www.google.com',
    summary: 'A stupid post'
}

chai.should();
chai.use(chaiHttp);

describe('Posts', () => {
    before(function() {

    });

    after(() => {
        Post.findOneAndDelete(samplePost, () => {})
    });

    it('Should create with valid attributes at POST /posts', done => {
        Post.find((err, posts) => {
            if (err) {
                return done(err);
            }

            const postCount = posts.length;

            chai.request(app).post('/posts').send(samplePost).then(res => {
                Post.find((err, updatedPosts) => {
                    postCount.should.be.equal(updatedPosts.length - 1);
                    res.should.have.status(200);
                    return done();
                })
            })
            .catch((error) => { return done(error); } );
        })
    })
});
