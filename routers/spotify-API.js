const express = require('express');
const fetch = require('node-fetch');
const {SPOTIFY_KEY_64} = require('../config');
const router = express.Router();
const shuffle = require('shuffle-array');


//endpoint is /api/users/rec/:weather
//get endpoint for random retrieval of spotify titles based on weather
router.get('/:weather', (req, res, next) => {
  const {weather} = req.params;
  // console.log(weather);
  let filippId = '';
  let kaitId = '';
  let kevinId = '';
  let brandonId = '';
  let ianId = '';
  let danceability = '';
  let energy = '';
  let valence = '';

  switch(weather){
  case 'Sunny':
    filippId = '0bRXwKfigvpKZUurwqAlEh';
    kaitId = '5RoIXwyTCdyUjpMMkk4uPd';
    kevinId = '17N5FdRwJuv3UXQ7MHnbhF';
    brandonId = '0Z7S8ity4SYlkzbJpejd1v';
    ianId = '6wmzz9dCztW1zgNXrZIyw8';
    // danceability = '0.6032';
    // energy = '0.7502';
    // valence = '0.5678';
    break;
  case 'Rainy':
    filippId = '3ZomZOKK49bjGzeNq5fi35';
    kaitId = '11jzYQcFcGpjXlTWVghPCI';
    kevinId = '41CgzGD7xlgnJe14R4cqkL';
    brandonId = '6MPB8398c9UmGCOes0eg7A';
    ianId = '2yM6bVAkaJP5YzTBlAgUbK';
    // danceability = '0.4744';
    // energy = '0.5226';
    // valence = '0.35';
    break;
  case 'Drizzle': 
    filippId = '2bBQg0zLuhXcVvqSSriawP';
    kaitId = '1RWRfknqqgTNNPO1EoP7Wo';
    kevinId = '5u5aVJKjSMJr4zesMPz7bL';
    brandonId = '1N49dCsfnMv00ezWlKdEGn';
    ianId = '0bKWn6sAxH8fSOAgS8z8t6';
    // danceability = '0.3294';
    // energy = '0.326';
    // valence = '0.24374';
    break;
  case 'Snowy': 
    filippId = '3Nx6iu7XpzWL1QMPRJKzqL';
    kaitId = '4gav2anVlQ5woM8KH37zpu';
    kevinId = '2QjOHCTQ1Jl3zawyYOpxh6';
    brandonId = '4ymHy4hzJ09WxvvT7p0Azy';
    ianId = '5j5VvsEHLlWT6IaEKSGDj9';
    // danceability = '0.631';
    // energy = '0.36364';
    // valence = '0.427';
    break;
  case 'Cloudy': 
    filippId = '77AB0zqvso8ALKUZ2HG2mG';
    kaitId = '21a1k8q3DJtsF8GorRfcL8';
    kevinId = '4kzyhn8i6Hf8daEBqNPfCy';
    brandonId = '6aXGgKVRGXlMqQYCIQqo4s';
    ianId = '2SPTGg9SC5MT1FwNX4IYfx';
    // danceability = '0.6508';
    // energy = '0.4952';
    // valence = '0.28898'; 
    break;
  case 'Thunderstorm':
    filippId = '12sYWro0wGQpq0rjE0lKcm';
    kaitId = '05sCp83gcMm1iecYydKJS3';
    kevinId = '0hL8yBivUahlm1rhQ1a0Xx';
    brandonId = '2Tgj50GmYGlswjb97lxiAf';
    ianId = '4e0GkgtMPZFt41Ua8PlHQL';
    // danceability = '0.5414';
    // energy = '0.618';
    // valence = '0.303';
    break;
  }
  //console.log(filippId, kevinId, kaitId, brandonId, ianId);
  const fetchSongUrl = 'https://api.spotify.com/v1/recommendations?seed_tracks='+
  `${filippId},${kaitId},${kevinId},${brandonId},${ianId}`+
  '&min_popularity=20&limit=100';
  
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
          // console.log(response);
          response = response.json();
          return response;
        }).then(response => {
          const songArr = [];
          // console.log(response);
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