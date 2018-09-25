
const User = require('../db/models/userSchema');
const {router: usersRouter} = require('./router');
const {router: playlistRouter} = require('./playlist');

module.exports = {User, usersRouter, };
