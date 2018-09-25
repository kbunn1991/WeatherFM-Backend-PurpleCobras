
const User = require('../db/models/userSchema');
const {router: usersRouter} = require('./users');
const {router: playlistsRouter} = require('./playlists');
const {router: authRouter} = require('./auth');

module.exports = {User, usersRouter, playlistsRouter, authRouter};
