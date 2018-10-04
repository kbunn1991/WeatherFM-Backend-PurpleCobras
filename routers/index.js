
const User = require('../db/models/userSchema');
const {router: usersRouter} = require('./users');
const {router: playlistsRouter} = require('./playlists');
const {router: authRouter} = require('./auth');
const {router: weatherRouter} = require('./weather-API');
const {router: spotifyRouter} = require('./spotify-API');
const {router: youtubeRouter} = require('./youtube-API');
const {router: updateUserRouter} = require('./update-user');

module.exports = {
  User, 
  usersRouter,
  updateUserRouter, 
  playlistsRouter, 
  authRouter, 
  weatherRouter,
  spotifyRouter,
  youtubeRouter
};
