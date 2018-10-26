'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {JWT_EXPIRY, JWT_SECRET} = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
};
 
const localAuth = passport.authenticate('local', {session: false});

// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  const newUser = {
    username: req.user.username,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
    id: req.user.id
  };
  const authToken = createAuthToken(newUser);
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const newUser = {
    username: req.user.username,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
    id: req.user.id
  };
  const authToken = createAuthToken(newUser);
  res.json({authToken});
});

module.exports = {router};
