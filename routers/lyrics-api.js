
const express = require('express');
const fetch = require('node-fetch');
const passport = require('passport');
const {LYRICS_API_KEY} = require('../config');
const router = express.Router();

//endpoint is /api/users/lyrics/:artist/:title
//get endpoint for lyrics of selected song and artist
//router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.get('/:artist/:title', (req, res, next) => {
  let {artist, title} = req.params;
  
  artist = artist.replace(new RegExp(' ', 'g'), '%20');
  title = title.replace(new RegExp(' ', 'g'), '%20');
  //console.log(title);
  const fetchLyricsUrl = `https://orion.apiseeds.com/api/music/lyric/${artist}/${title}?apikey=${LYRICS_API_KEY}`;

  console.log(fetchLyricsUrl);

  return fetch(fetchLyricsUrl, {
    method: 'GET',
    header: {
      'content-type': 'application/json'
    }
  })
    .then (result => {
      console.log(result);
      if (result.ok){
        return result.json();
      }
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;