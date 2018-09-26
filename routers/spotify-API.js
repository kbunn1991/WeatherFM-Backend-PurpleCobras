const express = require('express');
const fetch = require('node-fetch');
const {SPOTIFY_KEY_64} = require('../config');
const router = express.Router();

//endpoint is /api/users/rec/:weather
//WEATHER NOT YET IMPLEMENTED

router.get('/:weather', (req, res, next) => {
  const fetchSongUrl = 'https://api.spotify.com/v1/recommendations?seed_tracks=5uCax9HTNlzGybIStD3vDh,7795WJLVKJoAyVoOtCWqXN,69vToJ9BMbbLlFZo7k7A7B,1ab41ytPRTZ6fy8DjHCV2z,44T13PWJ87jb3lFElhVIHx&min_popularity=50&limit=5';
  const {weather} = req.params;
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