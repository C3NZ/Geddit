const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const Post = require('../models/post');
const User = require('../models/user');

const samplePost = {
    title: 'post title',
    url: 'http://www.google.com',
    summary: 'A stupid post',
    subreddit: 'random'
};

chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(app) 

describe('Posts', () => {
    before((done) => {
        agent
            .post('/auth/sign-up')
            .send({ username: 'realUser', password: 'reallyReal' })
            .end((err, res) => {
                if (err) return done(err);

                return done();
            })
    });

    after((done) => {
        Post
            .findOneAndDelete( {title: samplePost.title})
            .then(deletedPost => deletedPost)
            .catch(err => done(err));

        agent
            .get('/auth/logout')
            .end((err, res) => {
                if (err) return done(err);

            });

        User
            .findOneAndDelete({ username: 'realUser' })
            .then(user => done())
            .catch(err => done(err));
    });

    it('Should create with valid attributes at POST /posts', (done) => {
        Post
            .find()
            .then((posts) => {
                const postCount = posts.length;

                agent
                    .post('/posts')
                    .send(samplePost)
                    .end((err, res) => {
                        if (err) return done(err);
                        Post
                            .find()
                            .then((updatedPosts) => {
                                console.log('here')
                                postCount.should.be.equal(updatedPosts.length - 1);
                                res.status.should.be.equal(200)
                                
                                return done();
                            });
                    });

        }).catch(error => done(error));
    })
});
