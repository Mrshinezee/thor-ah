import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../..';

require('dotenv').config();

chai.should();

chai.use(chaiHttp);

// user expected to have been created in seeds
const author1Login = {
  email: 'author1@mail.com',
  password: process.env.AUTHOR_PASSWORD
};
const author2Login = {
  email: 'su@mail.com',
  password: process.env.USER_PASSWORD
};

let token = '';
let token2 = '';

describe('UserFollow controller', () => {
  // get token to use for article route testing
  it('', (done) => {
    chai.request(server).post('/api/users/login').set('Accept', 'application/json').send(author1Login)
      .end((err, resp) => {
        const userToken = resp.body.user.token;
        token = userToken;
        done();
      });
  });

  it('', (done) => {
    chai.request(server).post('/api/users/login').set('Accept', 'application/json').send(author2Login)
      .end((err, resp) => {
        const userToken = resp.body.user.token;
        token2 = userToken;
        done();
      });
  });

  describe('follow()', () => {
    it('should follow a given user', (done) => {
      chai.request(server)
        .post('/api/users/follow')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send({ email: author2Login.email })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('success');
          done();
        });
    });

    it('should return error if already following the user', (done) => {
      chai.request(server)
        .post('/api/users/follow')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send({ email: author2Login.email })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('should return error if the user to follow does not exist', (done) => {
      chai.request(server)
        .post('/api/users/follow')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send({ email: 'somethin@gwrong.email' })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('getFollowers()', () => {
    it('should return all users following the current user', (done) => {
      chai.request(server)
        .get('/api/users/follow/followers')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('getFollowings()', () => {
    it('should return all users that the current user is following', (done) => {
      chai.request(server)
        .get('/api/users/follow/followings')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('unfollow()', () => {
    it('should remove current user from following a given user', (done) => {
      chai.request(server)
        .delete('/api/users/follow')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send({ email: author2Login.email })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should return error if current user is not following given user', (done) => {
      chai.request(server)
        .delete('/api/users/follow')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token2}`)
        .set('Content-Type', 'application/json')
        .send({ email: author2Login.email })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
