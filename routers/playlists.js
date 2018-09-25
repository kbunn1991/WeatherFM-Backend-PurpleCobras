const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../db/models/userSchema');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));
//seed data password for user1 is password

//get all playlists for one specific user
router.get('/', (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  return User.findById(userId)
    .then(users => {
      console.log(users.playlists);
      console.log(users.playlists.Sunny);
      res.json(users.playlists);
    })
    .catch(err => 
      res.status(500).json({message: 'Internal server error'}));
});

router.put('/', (req, res, next) => {
  const {weather} = req.body;
  const {artist, songTitle} = req.body;
  const conct = artist + ', ' + songTitle;
  console.log(weather);
  console.log(conct, '---');
  const userId = req.user.id;
  const updateObj = {
    playlists: {$push : { 'Sunny' :  conct }}
  };
  console.log(userId, '===');
  return User.findByIdAndUpdate(userId, updateObj, {new: true})
    .then(result => {
      if(result){
        res.json(result);
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};