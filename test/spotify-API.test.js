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
            expect(song).to.have.keys('artist', 'songTitle', 'thumbnail', 'spotifyId');
          });
        });
    });
  });
  describe('POST /api/users/rec', function () {
    it('should return a new list of songs from spotify', function () {
      const averageObj = {
        danceability: .5,
        energy: .5,
        popularity: 50,
        valence: .5,
        acousticness: .5,
        loudness: -25,
        songId1: '17N5FdRwJuv3UXQ7MHnbhF',
        songId2: '0Z7S8ity4SYlkzbJpejd1v',
        songId3: '6wmzz9dCztW1zgNXrZIyw8',
      };
      return chai.request(app).post(`/api/users/rec`).set('Authorization', `Bearer ${token}`).send(averageObj)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          res.body.forEach(song => {
            expect(song).to.have.keys('artist', 'songTitle', 'thumbnail', 'spotifyId');
          });
        });
    });
  });
  describe('GET /api/users/rec/averages/:songIds', function () {
    it('should return average values for new playlist', function () {
      const songIds = '17N5FdRwJuv3UXQ7MHnbhF,0Z7S8ity4SYlkzbJpejd1v,6wmzz9dCztW1zgNXrZIyw8';
      return chai.request(app).get(`/api/users/rec/averages/${songIds}`).set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys(['acousticness', 'valence', 'danceability', 'energy', 'loudness']);
        });
    });
  });
});
