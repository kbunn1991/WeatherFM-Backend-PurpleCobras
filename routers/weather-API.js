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
  const numLat = Number(lat);
  const numLng = Number(lng);
  // console.log(numLat, numLng, typeof numLat);
  
  //extra error validation on the back-end for protection
  if(numLat < -90 || numLat > 90 ){
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Lattitude out of bounds.'
    });
  } 

  if(numLng < -180 || numLng > 180 ){
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Longitude out of bounds.'
    });
  } 

  // console.log(typeof lat);
  const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather'+
  `?lat=${lat}&lon=${lng}&APPID=${WEATHER_API_KEY}`;
  // console.log(lat, lng, WEATHER_API_KEY);
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
      let tempK = result.main.temp;
      // console.log(tempK, typeof tempK);
      let tempC = (tempK - 273.15).toFixed(0);
      let tempF = ((tempC * 1.8) + 32.00).toFixed(0);
      // console.log(tempC, tempF, result.weather);

      if(weatherId === 800){
        return res.json({weather: 'Sunny', tempC, tempF});
      } else if(weatherId >= 200 && weatherId <= 232){
        return res.json({weather: 'Thunderstorm', tempC, tempF});
      } else if(weatherId >= 300 && weatherId <= 321){
        return res.json({weather: 'Drizzle', tempC, tempF});
      } else if(weatherId >= 500 && weatherId <= 531){
        return res.json({weather: 'Rainy', tempC, tempF});
      } else if(weatherId >= 600 && weatherId <= 622){
        return res.json({weather: 'Snowy', tempC, tempF});
      } else if(weatherId >= 701 && weatherId <= 781){
        console.log(tempC, tempF);
        return res.json({weather: 'Cloudy', tempC, tempF});
      } else if(weatherId >= 800 && weatherId <= 804){
        console.log(tempC, tempF);
        return res.json({weather: 'Cloudy', tempC, tempF});
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};