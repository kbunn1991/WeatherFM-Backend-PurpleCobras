const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {type: String, require: true},
  username: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  playlists: 
    {
      Sunny: [String],
      Rainy: [String],
      Drizzle: [String],
      Snowy: [String],
      Cloudy: [String],
      Thunderstorm: [String]
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