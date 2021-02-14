var expect = require('chai').expect
const request = require('supertest');
const app = require('../../app')

describe('Index tests', function() {
describe('Send Message', function() {
    it('Send message without loggging in', function(done) {
      request(app)
      .post('/sendMessage')
      .set('Content-Type', 'application/json')
      .send({peer: 'guest2', message:'Hello World!'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.success).to.be.false;
        return done();
      });
    });
    it('Successful logging in', function(done) {
      // login and save the cookie
      request(app)
        .post('/login')
        .send({username: 'guest', password:'1234'})
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          sessionCookie = res.header['set-cookie'][0].split(';')[0]
          expect(res.body.success).to.be.true;
          return done();
        });
    });
    it('Send message with loggging in to not existing user', function(done) {
      request(app)
      .post('/sendMessage')
      .set('Content-Type', 'application/json')
      .set('Cookie', [sessionCookie])
      .send({peer: 'non-user', message:'Hello World!'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.success).to.be.false;
        return done();
      });
    });
    it('Send message with loggging in to existing user', function(done) {
      request(app)
      .post('/sendMessage')
      .set('Content-Type', 'application/json')
      .set('Cookie', [sessionCookie])
      .send({peer: 'guest2', message:'Hello World!'})
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.success).to.be.true;
        return done();
      });
    });
  });
});