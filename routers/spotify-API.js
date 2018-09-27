const express = require('express');
const fetch = require('node-fetch');
const {SPOTIFY_KEY_64} = require('../config');
const router = express.Router();

//endpoint is /api/users/rec/:weather
//WEATHER NOT YET IMPLEMENTED

router.get('/:weather', (req, res, next) => {
  const {weather} = req.params;
  console.log(weather);
  let filippId = '';
  let kaitId = '';
  let kevinId = '';
  let brandonId = '';
  let ianId = '';

  switch(weather){
  case 'Sunny':
    filippId = '0bRXwKfigvpKZUurwqAlEh';
    kaitId = '5RoIXwyTCdyUjpMMkk4uPd';
    kevinId = '17N5FdRwJuv3UXQ7MHnbhF';
    brandonId = '0Z7S8ity4SYlkzbJpejd1v';
    ianId = '6wmzz9dCztW1zgNXrZIyw8'; 
    break;
  case 'Rainy':
    filippId = '3ZomZOKK49bjGzeNq5fi35';
    kaitId = '11jzYQcFcGpjXlTWVghPCI';
    kevinId = '41CgzGD7xlgnJe14R4cqkL';
    brandonId = '6MPB8398c9UmGCOes0eg7A';
    ianId = '2yM6bVAkaJP5YzTBlAgUbK'; 
    break;
  case 'Drizzle': 
    filippId = '2bBQg0zLuhXcVvqSSriawP';
    kaitId = '1RWRfknqqgTNNPO1EoP7Wo';
    kevinId = '5u5aVJKjSMJr4zesMPz7bL';
    brandonId = '1N49dCsfnMv00ezWlKdEGn';
    ianId = '0bKWn6sAxH8fSOAgS8z8t6'; 
    break;
  case 'Snowy': 
    filippId = '3Nx6iu7XpzWL1QMPRJKzqL';
    kaitId = '4gav2anVlQ5woM8KH37zpu';
    kevinId = '2QjOHCTQ1Jl3zawyYOpxh6';
    brandonId = '4ymHy4hzJ09WxvvT7p0Azy';
    ianId = '5j5VvsEHLlWT6IaEKSGDj9';
    break;
  case 'Cloudy': 
    filippId = '77AB0zqvso8ALKUZ2HG2mG';
    kaitId = '21a1k8q3DJtsF8GorRfcL8';
    kevinId = '74hrUbWo7s2EmpQd29XwUd';
    brandonId = '0fZicSubz8bOekljVhk3PE';
    ianId = '2SPTGg9SC5MT1FwNX4IYfx'; 
    break;
  case 'Thunderstorm':
    filippId = '12sYWro0wGQpq0rjE0lKcm';
    kaitId = '05sCp83gcMm1iecYydKJS3';
    kevinId = '0hL8yBivUahlm1rhQ1a0Xx';
    brandonId = '2Tgj50GmYGlswjb97lxiAf';
    ianId = '4e0GkgtMPZFt41Ua8PlHQL';
    break;
  }
  console.log(filippId, kevinId, kaitId, brandonId, ianId);
  const fetchSongUrl = 'https://api.spotify.com/v1/recommendations?seed_tracks='
  +`${filippId},${kaitId},${kevinId},${brandonId},${ianId}&min_popularity=50&limit=5`;
  
  // https://api.spotify.com/v1/recommendations?seed_tracks=\
  // 5uCax9HTNlzGybIStD3vDh,7795WJLVKJoAyVoOtCWqXN,69vToJ9BMbbLlFZo7k7A7B,1ab41ytPRTZ6fy8DjHCV2z,44T13PWJ87jb3lFElhVIHx&\
  // min_popularity=50&limit=5
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
      console.log(fetchSongUrl);
      return fetch(fetchSongUrl,{
        method: 'GET',
        headers: {
          Authorization: `Bearer ${result.access_token}`
        }
      })
        .then(response => {
          console.log(response);
          response = response.json();
          return response;
        }).then(response => {
          const songArr = [];
          console.log(response);
          if(response){
            response.tracks.map(item => {
              songArr.push({
                artist: item.artists[0].name,
                songTitle : item.name,
                thumbnail: item.album.images[0].url
              });
            });
          }
          console.log(songArr);
          return res.json(songArr);
        });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};