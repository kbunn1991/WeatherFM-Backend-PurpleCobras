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

describe('WeatherFM API - Playlists', function () {

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

  describe('GET /api/users/playlists', function () {
    it('should return all playlists for that user', function () {
      return Promise.all([
        User.find()
        // .where('user').in([user.username, 'classic'])
          .sort('name'),
        chai.request(app).get('/api/users/playlists').set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          console.log(res.status);
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          //   expect(res.body).to.have.length(data.length);
        });
    });

    it('should return an object with correct fields', function () {
      return Promise.all([
        User.find()
          .sort('name'),
        chai.request(app).get('/api/users/playlists').set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('Sunny', 'Drizzle', 'Rainy', 'Snowy', 'Thunderstorm',
            'Cloudy');
        });
    });

  });

  describe('PUT /api/users/playlists', function () {
    it('should add song to playlist', function () {
      const updateItem = { weather: 'Sunny', artist: 'prince', songTitle: 'purple rain', thumbnail: 'blahblah' };
      let data;
      return User.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).put('/api/users/playlists').set('Authorization', `Bearer ${token}`).send(updateItem);
        })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.playlists).to.have.all.keys('Sunny', 'Drizzle', 'Rainy', 'Snowy', 'Thunderstorm',
            'Cloudy');
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(updateItem.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          // expect item to have been updated
          expect(res.body.playlists.Sunny.length).to.greaterThan(data.playlists.Sunny.length);
        });
    });
    it('should return error if add song to playlist thats already there', function () {
      // const updateItem = { weather: 'Sunny', artist: 'prince', songTitle: 'purple rain', thumbnail: 'blahblah' };
      let data;
      let song;
      return User.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get('/api/users/playlists').set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          song = res.body['Sunny'][0];
          song.weather = 'Sunny';
          return chai.request(app).put('/api/users/playlists').set('Authorization', `Bearer ${token}`).send(song);
        })
        .then((res) => {
          expect(res).to.have.status(422);
        });
    });
  });

  describe('DELETE /api/users/playlists', function () {
    it('should delete a song and return the new playlists', function () {
      const weather= 'Sunny'; 
      const songTitle= 'Lovely Day';
      let data;
      return User.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app)
            .delete(`/api/users/playlists/${weather}/${songTitle}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(function (res) {
          console.log(res.body);
          expect(res).to.have.status(204);
        });
    });
  });
});
