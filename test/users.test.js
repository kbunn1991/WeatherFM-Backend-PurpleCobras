const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../db/models/userSchema');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;

describe('WeatherFM API - Users', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const lastName = 'User';

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return User.createIndexes();
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });
  describe('/api/users', function () {
    describe('POST', function () {
      it('Should reject users with missing username', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            password,
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Missing \'username\' in request body');
          });
      });
      it('Should reject users with missing password', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Missing \'password\' in request body');
          });
      });
      it('Should reject users with non-string username', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username: 1234,
            password,
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
          });
      });
      it('Should reject users with non-string password', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password: 1234,
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
          });
      });
      it('Should reject users with non-trimmed username', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username: ` ${username} `,
            password,
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
          });
      });
      it('Should reject users with non-trimmed password', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password: ` ${password} `,
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
          });
      });
      it('Should reject users with empty username', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username: '',
            password,
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
          });
      });
      it('Should reject users with password less than 6 characters', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password: '12345',
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal(
              'Must be at least 6 characters long'
            );
          });
      });
      it('Should reject users with password greater than 72 characters', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password: new Array(73).fill('a').join(''),
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal(
              'Must be at most 72 characters long'
            );
          });
      });
      it('Should reject users with duplicate username', function () {
        // Create an initial user
        return User.create({
          username,
          password,
        })
          .then(() =>
            // Try to create a second user with the same username
            chai.request(app).post('/api/users').send({
              username,
              password,
            })
          )
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal(
              'Username already taken'
            );
          });
      });
      it('Should create a new user', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password,
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'createdAt',
              'updatedAt',
              'id',
              'playlists'
            );
            expect(res.body.username).to.equal(username);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
      // it('Should trim firstName', function () {
      //   return chai
      //     .request(app)
      //     .post('/api/users')
      //     .send({
      //       username,
      //       password
      //     })
      //     .then(res => {
      //       expect(res).to.have.status(201);
      //       expect(res.body).to.be.an('object');
      //       expect(res.body).to.have.keys(
      //         'username',
      //         'createdAt',
      //         'updatedAt',
      //         'playlists',
      //         'id'
      //       );
      //       expect(res.body.username).to.equal(username);
      //       return User.findOne({
      //         username
      //       });
      //     })
      //     .then(user => {
      //       expect(user).to.not.be.null;
      //     });
      // });
    });
  });
});

