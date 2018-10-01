const express = require('express');
const fetch = require('node-fetch');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {WEATHER_API_KEY} = require('../config');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));
//api/users/weather

//get weather endpoint for openweathermap.com provided lat and lng
router.get('/:lat/:lng', (req, res, next) => {
  const {lat, lng} = req.params;
  const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather'+
  `?lat=${lat}&lon=${lng}&APPID=${WEATHER_API_KEY}`;
  console.log(lat, lng, WEATHER_API_KEY);
  return fetch(weatherUrl, {
    method: 'GET',
    headers: {
      'content-type' : 'application/json'
    }
  })
    .then(result => {
      result = result.json();
      return result;
    })
    .then(result => {
      const weatherId = result.weather[0].id;
      // console.log(result.weather);
      // console.log('--->', weatherId);
      //returns a String
      if(weatherId === 800){
        return res.json('Sunny');
      } else if(weatherId >= 200 && weatherId <= 232){
        return res.json('Thunderstorm');
      } else if(weatherId >= 300 && weatherId <= 321){
        return res.json('Drizzle');
      } else if(weatherId >= 500 && weatherId <= 531){
        return res.json('Rainy');
      } else if(weatherId >= 600 && weatherId <= 622){
        return res.json('Snowy');
      } else if(weatherId >= 701 && weatherId <= 781){
        return res.json('Cloudy');
      } else if(weatherId >= 800 && weatherId <= 804){
        return res.json('Cloudy');
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};