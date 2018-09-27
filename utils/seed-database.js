const mongoose = require('mongoose');

const {DATABASE_URL} = require('../config');

const User = require('../db/models/userSchema');

const seedUsers = require('../db/seed/users');

mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() =>{
    return Promise.all([
      User.insertMany(seedUsers),
      User.createIndexes,
    ]);
  })
  .then(results =>{
    console.info('Init db with Users');
  })
  .then(() => mongoose.disconnect())
  .catch(err =>{
    console.error(err);
  });