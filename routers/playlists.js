const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../db/models/userSchema');

const router = express.Router();

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
//seed data password for user1 is password

//---------get all playlists for one specific user
router.get('/', jwtAuth, (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  return User.findById(userId)
    .then(users => {
      res.json(users.playlists);
    })
    .catch(err => {
      next(err);
    });
});

//-------- add a song to a playlist
<<<<<<< HEAD
router.put('/', (req, res, next) => {
  console.log(req.body);
=======
router.put('/', jwtAuth, (req, res, next) => {
>>>>>>> fa3d155af047c82244d33ec454d38ce34520b42d
  const {weather} = req.body;
  const {spotifyId, artist, songTitle, thumbnail} = req.body;
  const songObj = {spotifyId, artist, songTitle, thumbnail};
  // console.log(weather);
  // console.log(songObj, '---');
  const userId = req.user.id;
  // if (!weather || !artist || !songTitle) {
  //   return res.status(422).json({
  //     code: 422,
  //     reason: 'ValidationError',
  //     message: `Missing weather or song info in request body`,
  //   });
  // }

  return User.findById(userId)
    .then(result => {
      // console.log(result);
      if(result){
        // console.log(songObj);
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
router.delete('/:weather/:songTitle', jwtAuth, (req, res, next) => {
  const {weather, songTitle} = req.params;
  // console.log(weather);
  const userId = req.user.id;
  return User.findById(userId)
    .then(result => {
      if(result){
        let newResults = result.playlists[weather]
          .filter(song => song.songTitle !== songTitle);
        // console.log(newResults)
        result.playlists[weather] = newResults;
        // console.log(result)
        result.save();
        res.sendStatus(204);
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};