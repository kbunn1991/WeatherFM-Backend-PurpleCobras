

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

describe('WeatherFM API - spotify API', function () {
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

  describe('GET /api/users/rec/:weather', function () {
    it('should return a list of songs from spotify', function () {
      const weather = 'Rainy';
      return chai.request(app).get(`/api/users/rec/${weather}`).set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          res.body.forEach(song => {
            expect(song).to.have.keys('artist', 'songTitle', 'thumbnail');
          });
        });
    });
  });
});
