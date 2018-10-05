'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const {DATABASE_URL} = require('./config'); 
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');
const {usersRouter } = require('./routers');
const {playlistsRouter } = require('./routers');
const {authRouter} = require('./routers');
const {weatherRouter} = require('./routers'); 
const {spotifyRouter} = require('./routers'); 
const {youtubeRouter} = require('./routers');
const {updateUserRouter} = require('./routers');

const app = express();
app.use(express.json());

app.use(bodyParser.json());

//logger middleware
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

//cross origin
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

//auth
passport.use(localStrategy);
passport.use(jwtStrategy);

//routers
app.use('/api/users/', usersRouter);
app.use('/api/users/', updateUserRouter);
app.use('/api/users/playlists', playlistsRouter);
app.use('/api/auth/', authRouter);
app.use('/api/users/weather', weatherRouter);
app.use('/api/users/rec', spotifyRouter);
app.use('/api/users/youtube', youtubeRouter);
//app.use('/api/users/lyrics', lyricsRouter);


//error handling
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Custom Error Handler
app.use((err, req, res, next) => {
  console.log(err,'!!!!!', err.status, err.message);
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  // Connect to DB and Listen for incoming connections
  mongoose.connect(DATABASE_URL)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
      console.error(err);
    });

  app.listen(PORT, function () {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports =  app;
