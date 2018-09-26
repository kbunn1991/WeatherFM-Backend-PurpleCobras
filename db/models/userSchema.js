const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {type: String, require: true},
  username: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  playlists: 
    {
      Sunny: [{
        artist: {type: String, required: true},
        songTitle: {type: String, required: true},
        albumPng: {type: String}
      }],
      Rainy: [{
        artist: {type: String, required: true},
        songTitle: {type: String, required: true},
        albumPng: {type: String}
      }],
      Drizzle: [{
        artist: {type: String, required: true},
        songTitle: {type: String, required: true},
        albumPng: {type: String}
      }],
      Snowy: [{
        artist: {type: String, required: true},
        songTitle: {type: String, required: true},
        albumPng: {type: String}
      }],
      Cloudy: [{
        artist: {type: String, required: true},
        songTitle: {type: String, required: true},
        albumPng: {type: String}
      }],
      Thunderstorm: [{
        artist: {type: String, required: true},
        songTitle: {type: String, required: true},
        albumPng: {type: String}
      }]
    }
});

userSchema.set('timestamps', true);

userSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.password;
  }
});

// Note: Use `function` (not an `arrow function`) to allow setting `this`
userSchema.methods.validatePassword = function (pwd) {
  const currentUser = this;
  return bcrypt.compare(pwd, currentUser.password);
};

userSchema.statics.hashPassword = function (pwd) {
  return bcrypt.hash(pwd, 10);
};

module.exports = mongoose.model('User', userSchema);