
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const {SPOTIFY_KEY_64} = require('../config');
const songData = require('../db/data/data');

const User = require('../db/models/userSchema');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
router.post('/', jsonParser, (req, res, next) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: `Missing '${missingField}' in request body`,
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 6,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {
    username, 
    password, 
    firstName = '', 
    Sunny, 
    Rainy, 
    Drizzle, 
    Snowy,
    Cloudy, 
    Thunderstorm} = req.body;

  const weatherArr = [
    {Sunny}, 
    {Rainy}, 
    {Drizzle}, 
    {Snowy},
    {Cloudy}, 
    {Thunderstorm}
  ];

  const getSongFromSpotify = function (arr, resolve, accessToken){
    const promises = arr.map(item => {
      let songDetails = `https://api.spotify.com/v1/search?type=track&limit=1&q=${item.songTitle}+${item.artist}`;
      console.log(songDetails, '-----------------');
      return fetch(songDetails, 
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        .then(response => {
          // console.log(response);
          response = response.json();
          return response;
        })
        .then(response => {
          if(response.tracks.items[0]){
            return ({
              spotifyId: response.tracks.items[0].id,
              artist: response.tracks.items[0].artists[0].name,
              songTitle: response.tracks.items[0].name,
              thumbnail: response.tracks.items[0].album.images[0].url           
            });
          }
        });
    });
    Promise.all(promises)
      .then(result => {
        resolve(result);
      });
  };

  console.log(Sunny.length);
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  let hash;
  User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(_hash => {
      hash = _hash;
      //
      //getting token
      //
      return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          Authorization: `Basic ${SPOTIFY_KEY_64}`
        },
        body: 'grant_type=client_credentials'
      })
        .then(result => {
          result = result.json();
          return result;
        })
        .then(result => {
          let accessToken = result.access_token;
          const promises = weatherArr.map(item => {
            return new Promise((resolve, reject) => {
              const arr = Object.values(item)[0];
              if(arr.length){
                console.log('custom songs');
                getSongFromSpotify(arr, resolve, accessToken);
              }
              else{
                const weather = Object.keys(item)[0];
                console.log(songData[weather], 'default songs');
                resolve(songData[weather]); 
              }
            });
          });
          return Promise.all(promises);
          // return Sunny, Rainy, Drizzle, Snowy, Cloudy, Thunderstorm;
        });
    })
    .then(result => {
      console.log(result, '111111111111111111111111111111111111111111111111111111111111');
      return User.create({
        username,
        password: hash,
        firstName,
        playlists: {
          Sunny: result[0],
          Rainy: result[1],
          Drizzle: result[2],
          Snowy : result[3],
          Cloudy : result[4],
          Thunderstorm : result[5]
        }
      });
    })
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      next(err);
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res, next) => {
  return User.find()
    .then(users => res.json(users.map(user => user)))
    .catch(err => {
      next(err);
    });
});

module.exports = {router};
