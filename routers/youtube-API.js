
const express = require('express');
const fetch = require('node-fetch');
const passport = require('passport');
const { YOUTUBE_API_KEY } = require('../config');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.get('/:artist/:songTitle', jwtAuth, (req, res, next) => {
  let artist = req.params.artist.replace(/[&]/g, '%20');
  let songTitle = req.params.songTitle.replace(/[&]/g, '%20');
  let youtubeUrl = 'https://www.googleapis.com/youtube/v3/search'+
  `?key=${YOUTUBE_API_KEY}&q=${artist}+${songTitle}+lyrics&part=snippet&maxResults=1&type=video`;
  

  // console.log(YOUTUBE_API_KEY)
  return fetch(youtubeUrl, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(result => {
      result = result.json();
      return result;
    })
    .then(result => {
      // console.log(result.items[0].snippet.title);
      let videoTitle = result.items[0].snippet.title;
      let videoId = result.items[0].id.videoId;
      let videoURL = 'https://www.youtube.com/watch?v=' + videoId;
      let videoInfo = {videoTitle, videoURL};
      // console.log(videoInfo);
      return res.json(videoInfo);
    }) 
    .catch(err => {
      next(err);
    });
}); 


module.exports = { router };