const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(app);
const User = require('../models/user');

describe('User', () => {
    
    after(() => {
        User
            .findOneAndDelete({ username: 'realUser'})
            .then((user) => {
                return console.log(user);
            })
    })
    
    it('should not be able to login if the user isnt registered', (done) => {
        agent
            .post('/auth/sign-in')
            .send({ username: 'testLogin', password: 'nope' })
            .end((err, res) => {
                if (err) return done(err);

                res.status.should.be.equal(401);
                return done();
            });
    });

    it('should allow the user to sign up for the website', (done) => {
        agent
            .post('/auth/sign-up')
            .send({ username: 'realUser', password: 'real' })
            .end((err, res) => {
                if (err) return done(err);

                res.status.should.be.equal(200);
                agent.should.have.cookie('nToken'); 
                return done();
            });
    });

    it('should allow the user to log out', (done) => {
        agent
            .get('/auth/logout')
            .end((err, res) => {
                if (err) return done(err);

                res.status.should.be.equal(200);
                agent.should.not.have.cookie('nToken');
                return done();
            })
    })
    it('should allow the user to sign in if registered', (done) => {
        agent
            .post('/auth/sign-in')
            .send({ username: 'realUser', password: 'real' })
            .end((err, res) => {
                if (err) return done(err);

                res.status.should.be.equal(200);
                agent.should.have.cookie('nToken');
                return done();
            })
    })


});
