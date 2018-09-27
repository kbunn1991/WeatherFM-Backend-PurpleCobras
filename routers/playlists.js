const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../db/models/userSchema');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));
//seed data password for user1 is password

//---------get all playlists for one specific user
router.get('/', (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  return User.findById(userId)
    .then(users => {
      res.json(users.playlists);
    })
    .catch(err => 
      res.status(500).json({message: 'Internal server error'}));
});

//-------- add a song to a playlist
router.put('/', (req, res, next) => {
  const {weather} = req.body;
  const {artist, songTitle, albumPng} = req.body;
  const songObj = {artist, songTitle, albumPng};
  // console.log(weather);
  // console.log(songObj, '---');
  const userId = req.user.id;
  // console.log(userId, '===');
  return User.findById(userId)
    .then(result => {
      console.log(result);
      if(result){
        result.playlists[weather].push(songObj);
      }
      result.save();
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

//--------remove a song from a playlist
router.delete('/', (req, res, next) => {
  const {weather} = req.body;
  const {artist, songTitle, albumPng} = req.body;
  const songObj = {artist, songTitle, albumPng};
  console.log(weather);
  // console.log(songObj, '---');
  const userId = req.user.id;
  return User.findById(userId)
    .then(result => {
      if(result){
        let newResults = result.playlists[weather].filter(song => song.songTitle !== songObj.songTitle);
        console.log(newResults);
        result.playlists[weather] = newResults;
        console.log(result);
      }
      result.save();
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};