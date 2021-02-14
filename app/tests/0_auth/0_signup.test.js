var expect = require('chai').expect
const request = require('supertest');
const app = require('../../app')

describe('Auth tests', function() {
  describe('Signup', function() {
    it('User create with insufficient credentials', function(done) {
      request(app)
        .post('/signup')
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
    it('User create with insufficient credentials', function(done) {
      request(app)
        .post('/signup')
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
    it('User create', function(done) {
      request(app)
        .post('/signup')
        .send({username: 'guest', password:'1234'})
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.success, "Did you forget to reset testing database?").to.be.true;
          return done();
        });
    });
    it('Create another user', function(done) {
      request(app)
        .post('/signup')
        .send({username: 'guest2', password:'1234'})
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.success, "Did you forget to reset testing database?").to.be.true;
          return done();
        });
    });
    it('Duplicate user create', function(done) {
      request(app)
        .post('/signup')
        .send({username: 'guest', password:'1234'})
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
    it('Duplicate user create with different password', function(done) {
      request(app)
        .post('/signup')
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
  });
});