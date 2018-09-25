
const User = require('../db/models/userSchema');
const {router: usersRouter} = require('./users');
const {router: playlistRouter} = require('./playlist');
const {router: authRouter} = require('./auth');

module.exports = {User, usersRouter, playlistRouter, authRouter};
