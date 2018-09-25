const express = require('express');

const User = require('../db/models/userSchema');

const router = express.Router();

router.post('/playlist', (req, res, next) => {
  return User.find()
    .then(users => res.json(users.map(user => user)))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};