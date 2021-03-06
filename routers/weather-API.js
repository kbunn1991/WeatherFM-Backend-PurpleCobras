const express = require('express');
const fetch = require('node-fetch');
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
const {WEATHER_API_KEY} = require('../config');

const router = express.Router();

// const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });
///api/users/weather
//get weather endpoint for openweathermap.com provided lat and lng
router.get('/:lat/:lng/:cityZip', (req, res, next) => {
  const {lat, lng, cityZip} = req.params;
  let parameters = '';

  if (lat !== '_') {
    parameters = `lat=${lat}&lon=${lng}`;
  } else if (cityZip !== '_') {
    parameters = `q=${cityZip},us`;
  }

  const numLat = Number(lat);
  const numLng = Number(lng);
  
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

  const weatherUrl = 'http://api.openweathermap.org/data/2.5/weather'+
  `?${parameters}&APPID=${WEATHER_API_KEY}`;

  return fetch(weatherUrl, {
    method: 'GET',
    headers: {
      'content-type' : 'application/json'
    }
  })
    .then(result => {
      return result.json();
    })
    .then(result =>{
      if(result.cod !== 200){
        const err = new Error('Invalid city or zip-code. Please try again');
        err.status = 404;
        return next(err);
      }
      return result;
    })
    .then(result => {
      const weatherId = result.weather[0].id;
      let tempK = result.main.temp;
      let tempC = (tempK - 273.15).toFixed(0);
      let tempF = ((tempC * 1.8) + 32.00).toFixed(0);

      if(weatherId === 800)
        return res.json({weather: 'Sunny', tempC, tempF});

      else if(weatherId >= 200 && weatherId <= 232) 
        return res.json({weather: 'Thunderstorm', tempC, tempF});

      else if(weatherId >= 300 && weatherId <= 321)
        return res.json({weather: 'Drizzle', tempC, tempF});

      else if(weatherId >= 500 && weatherId <= 531)
        return res.json({weather: 'Rainy', tempC, tempF});

      else if(weatherId >= 600 && weatherId <= 622)
        return res.json({weather: 'Snowy', tempC, tempF});

      else if(weatherId >= 701 && weatherId <= 781)
        return res.json({weather: 'Cloudy', tempC, tempF});

      else if(weatherId >= 800 && weatherId <= 804)
        return res.json({weather: 'Cloudy', tempC, tempF});

    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};