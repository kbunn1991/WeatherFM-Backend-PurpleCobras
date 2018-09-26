const express = require('express');
const fetch = require('node-fetch');
const { YOUTUBE_API_KEY } = require('../config');

const router = express.Router();


router.get('/:song', (req, res, next) => {
  const song = req.params.song
  // console.log(YOUTUBE_API_KEY)
  return fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=${song}+lyrics&part=snippet&maxResults=1&type=video`, {
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
      let videoId = result.items[0].id.videoId;
      let videoURL = 'https://www.youtube.com/watch?v=' + videoId
      console.log(videoURL)
      return res.json(videoURL);
    })
    .catch(err => {
      next(err);
    });
});


module.exports = { router };