var expect = require('chai').expect
const request = require('supertest');
const app = require('../../app')

describe('Auth tests', function() {
  describe('Login', function() {
    it('User login with insufficient credentials', function(done) {
      request(app)
        .post('/login')
        .send({username: 'guest'})
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
    it('User login with insufficient credentials', function(done) {
      request(app)
        .post('/login')
        .send({password:'1234'})
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
    it('Invalid password', function(done) {
      request(app)
        .post('/login')
        .send({username: 'guest', password:'12345'})
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
    it('Non-existing username', function(done) {
      request(app)
        .post('/login')
        .send({username: 'non-user', password:'1234'})
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.success, "Did you forgot to reset testing database?").to.be.false;
          return done();
        });
    });
    it('Successful login', function(done) {
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
          expect(res.body.success).to.be.true;
          return done();
        });
    });
  });
});