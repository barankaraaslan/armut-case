var expect = require('chai').expect
const request = require('supertest');
const app = require('../../app')

describe('Auth tests', function() {
  describe('Logout', function() {
    it('User logout without logging in', function(done) {
      request(app)
        .post('/logout')
        .set('Content-Type', 'application/json')
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
    it('Successful logout', function(done) {
      request(app)
        .post('/logout')
        .set('Cookie', [sessionCookie])
        .set('Content-Type', 'application/json')
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