const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../app')

describe('Auth tests', function() {
  it('signup', function(done) {
    this.timeout(50000);
    request(app)
      .post('/signup')
      .send({username: 'guest', password:'1234'})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  });
});