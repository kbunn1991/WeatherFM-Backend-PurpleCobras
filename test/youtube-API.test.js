

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');

const User = require('../db/models/userSchema');
const seedUsers = require('../db/seed/users');

const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;

let token;
let user;

describe('WeatherFM API - youtube API', function () {
  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });
  beforeEach(function () {
    return Promise.all([
      User.insertMany(seedUsers),
    ])
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/users/youtube/:artist/:song/:mode', function () {
    //think theres some issue with the code on backend because its returning the
    //entire user instead of just the youtube url


    it('should return a valid youtube url', function () {
      const artist = 'prince';
      const songTitle = 'purple+rain';
      const mode = 'video';
      return Promise.all([
        chai.request(app).get(`/api/users/youtube/${artist}/${songTitle}/${mode}`).set('Authorization', `Bearer ${token}`)
      ])
        .then(([res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys(['videoTitle', 'videoURL'])
        });
    });
  });
});
