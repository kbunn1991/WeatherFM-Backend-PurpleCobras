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

describe('WeatherFM API - update user API', function () {
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

  describe('PUT /api/users', function () {
    it('it should update user with default seed songs if they skip onboarding', function () {
      const defaultSongArr = [
        {Sunny: []},
        {Rainy: []},
        {Drizzle: []},
        {Snowy: []},
        {Cloudy: []},
        {Thunderstorm: []}
      ]
      return chai.request(app).put(`/api/users/`).set('Authorization', `Bearer ${token}`).send(defaultSongArr)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.equal('OK')
          // expect(res.body).to.have.keys(['weather', 'tempC', 'tempF']);
        });
    });
    it('it should update user with default seed songs that they added', function () {
      const songArr = [
        {Sunny: [{artist: "smash mouth", songTitle: "all star"}]},
        {Rainy: []},
        {Drizzle: []},
        {Snowy: []},
        {Cloudy: []},
        {Thunderstorm: []}
      ]
      return chai.request(app).put(`/api/users/`).set('Authorization', `Bearer ${token}`).send(songArr)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.equal('OK')
          // expect(res.body).to.have.keys(['weather', 'tempC', 'tempF']);
        });
    });
  });
});
