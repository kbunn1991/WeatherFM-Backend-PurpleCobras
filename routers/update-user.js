const express = require('express');
const fetch = require('node-fetch');
const passport = require('passport');
const {SPOTIFY_KEY_64} = require('../config');
const songData = require('../db/data/data');
const User = require('../db/models/userSchema');
const getSongFromSpotify = require('./helpers/getSongFromSpotify');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.put('/', jwtAuth, (req, res, next) => {
  // console.log(req.body, 'req.body');
  const userId = req.user.id;
  // console.log(userId);
  let userData;

  let {
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
  
  return User.findById(userId)
    .then(response => {
      userData = response;
      //
      //getting token
      //
      if(response){
        return fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            Authorization: `Basic ${SPOTIFY_KEY_64}`
          },
          body: 'grant_type=client_credentials'
        })
          .then(result => {
            return result.json();
          })
          .then(result => {
            const promises = weatherArr.map(item => {
              return new Promise((resolve, reject) => {
                const arr = Object.values(item)[0];
                // console.log(arr)
                if(arr.length){
                  getSongFromSpotify(arr, resolve, result.access_token);
                }
                else{
                  const weather = Object.keys(item)[0];
                  // console.log(songData[weather]);
                  resolve(songData[weather]); 
                }
              });
            });
            return Promise.all(promises);
          });
      }
    })
    .then(result => {
      const arr = [];
      result.map(playlist => {
        return playlist.map(track => {
          if(track.message) arr.push(track);
        });
      });
      // console.log(arr, '*******************');
      if(arr.length) return res.json(arr);
      else{  
      // console.log(result, '---------------------');
        userData.playlists.Sunny = result[0];
        userData.playlists.Rainy = result[1];
        userData.playlists.Drizzle = result[2];
        userData.playlists.Snowy = result[3];
        userData.playlists.Cloudy = result[4];
        userData.playlists.Thunderstorm = result[5];
        userData.save();
        return res.status(200).json('OK');
      }
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

module.exports = {router};