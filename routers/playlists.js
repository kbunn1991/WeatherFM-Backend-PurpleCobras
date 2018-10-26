'use strict';
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
  // console.log(userId);
  return User.findById(userId)
    .then(users => {
      res.json(users.playlists);
    })
    .catch(err => {
      next(err);
    });
});

//-------- add a song to a playlist
router.put('/', jwtAuth, (req, res, next) => {
  const { weather } = req.body;
  const { spotifyId, artist, songTitle, thumbnail } = req.body;
  const songObj = { spotifyId, artist, songTitle, thumbnail };
  // console.log(weather);
  // console.log(songObj, '---');
  const userId = req.user.id;

  return User.findById(userId)
    .then(result => {
      // console.log(result);
      if (result) {
        // console.log(songObj);
        // console.log(result.playlists[weather])
        let duplicate = result.playlists[weather].filter(song => song.songTitle === songObj.songTitle && song.artist === songObj.artist);
        // console.log(duplicate)
        if (duplicate.length) {
          // console.log("HEEEEYYYY")
          res.status(422).end();
        } else {
          result.playlists[weather].push(songObj);
          result.save();
          res.json(result);
        }
      }
    })
    .catch(err => {
      next(err);
    });
});

//--------remove a song from a playlist
router.delete('/:weather/:songTitle', jwtAuth, (req, res, next) => {
  const { weather, songTitle } = req.params;
  // console.log(weather);
  const userId = req.user.id;
  return User.findById(userId)
    .then(result => {
      if (result) {
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

module.exports = { router };