const express = require('express');
const passport = require('passport');
const fetch = require('node-fetch');
const {SPOTIFY_KEY_64} = require('../config');
const shuffle = require('shuffle-array');
const User = require('../db/models/userSchema');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

//endpoint is /api/users/rec/:weather
//get endpoint for random retrieval of spotify titles based on weather
router.get('/:weather', (req, res, next) => {
  const {weather} = req.params;
  const userId = req.user.id;

  let songList = [];

  return User.findById(userId)
    .then(users => {
      songList = users.playlists[weather];
      shuffle(songList);
      songList = songList.slice(0, 5).map(item => {
        return item.spotifyId;
      }).join();
    })
    .then(()=> {
      fetch('https://accounts.spotify.com/api/token', {
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
          const fetchSongUrl = 'https://api.spotify.com/v1/recommendations?seed_tracks='+
          `${songList}`+
           '&min_popularity=20&limit=100';
          fetch(fetchSongUrl, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${result.access_token}`
            }
          })
            .then(response => {
              return response.json();
            })
            .then(response => {
              const songArr = [];
              if(response){
                response.tracks.map(item => {
                  songArr.push({
                    artist: item.artists[0].name,
                    songTitle : item.name,
                    thumbnail: item.album.images[0].url
                  });
                });
              }
              shuffle(songArr);
              return res.json(songArr);
            })
            .catch(err => {
              next(err);
            });
        })
        .catch(err => {
          next(err);
        });
    })
    .catch(err => {
      next(err);
    });
});

//POST ENDPOINT FOR SLIDER

router.post('/', (req, res, next) => {
  // console.log(weather);
  // const {danceability} = req.params.danceability;
  const {danceability, energy, popularity, valence, acousticness, loudness} = req.body;
  console.log('HITTTTTING POST ENDPOINT');
  console.log(req.body);
  console.log('dance!!', danceability);
  
  // const fetchSongUrl = 'https://api.spotify.com/v1/recommendations?seed_tracks='+
  // `${filippId},${kaitId},${kevinId},${brandonId},${ianId}`+
  // '&min_popularity=20&limit=100';
  
  // `seed_tracks=0bRXwKfigvpKZUurwqAlEh`+

  //HAVE ONE SEED SONG HARDCODED INTO URL, SO NEED TO ADD VARIABLE SONGIDS

  const fetchSongUrl = 'https://api.spotify.com/v1/recommendations?'+ 'seed_tracks=0bRXwKfigvpKZUurwqAlEh'+
  `&min_popularity=${popularity}&target_energy=${energy}&target_danceability=${danceability}&target_valence=${valence}&limit=100` +
  `&target_loudness${loudness}&target_acousticness${acousticness}`;

  // console.log(weather, SPOTIFY_KEY_64);
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
      // console.log(result.access_token);
      return fetch(fetchSongUrl,{
        method: 'GET',
        headers: {
          Authorization: `Bearer ${result.access_token}`
        }
      })
        .then(response => {
          // console.log(response.body);
          response = response.json();
          return response;
        }).then(response => {
          const songArr = [];
          console.log(response);
          if(response.tracks !== []){
            response.tracks.map(item => {
              songArr.push({
                artist: item.artists[0].name,
                songTitle : item.name,
                thumbnail: item.album.images[0].url
              });
            });
            shuffle(songArr);
            return res.json(songArr);
          } else if (response.tracks === []) {
            return res.status(423);
          }
        });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};