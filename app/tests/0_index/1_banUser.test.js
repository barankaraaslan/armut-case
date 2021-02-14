var expect = require('chai').expect
const request = require('supertest');
const app = require('../../app')

describe('Index tests', function() {
  describe('Ban', function() {
    it('Ban without loggging in', function(done) {
      request(app)
      .post('/banUser')
      .set('Content-Type', 'application/json')
      .send({peer: 'guest2'})
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
    it('Ban not existing user', function(done) {
      request(app)
        .post('/banUser')
        .set('Content-Type', 'application/json')
        .set('Cookie', [sessionCookie])
        .send({peer: 'non-user'})
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
    it('Successfully ban existing user', function(done) {
      request(app)
        .post('/banUser')
        .set('Content-Type', 'application/json')
        .set('Cookie', [sessionCookie])
        .send({peer: 'guest2'})
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
    it('Ban already banned user', function(done) {
      request(app)
        .post('/banUser')
        .set('Content-Type', 'application/json')
        .set('Cookie', [sessionCookie])
        .send({peer: 'guest2'})
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
    it('Successfully Unban already banned user', function(done) {
      request(app)
        .post('/unbanUser')
        .set('Content-Type', 'application/json')
        .set('Cookie', [sessionCookie])
        .send({peer: 'guest2'})
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
    it('Unban already not banned user', function(done) {
      request(app)
        .post('/unbanUser')
        .set('Content-Type', 'application/json')
        .set('Cookie', [sessionCookie])
        .send({peer: 'guest2'})
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