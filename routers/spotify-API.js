const express = require('express');
const fetch = require('node-fetch');
const {SPOTIFY_KEY_64} = require('../config');
const {URLSearchParams} = require('url');
const router = express.Router();

//endpoint is /api/users/rec/:weather
router.get('/:weather', (req, res, next) => {
  // const params = new URLSearchParams();
  // params.append('grant_type', 'client_credentials');
  const {weather} = req.params;
  console.log(weather, SPOTIFY_KEY_64);
  return fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded',
      Authorization: `Basic ${SPOTIFY_KEY_64}`
    },
    body: {
      grant_type: 'client-credentials'
    }
  })
    .then(result => {
      result = result.json();
      return result;
    })
    .then(result => {
      console.log(result);
    
      return res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};