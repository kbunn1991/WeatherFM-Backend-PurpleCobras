const express = require('express');
const fetch = require('node-fetch');
const {WEATHER_API_KEY} = require('../config');

const router = express.Router();

router.get('/:lat/:lng', (req, res, next) => {
  const {lat, lng} = req.params;
  console.log(lat, lng, WEATHER_API_KEY);
  return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${WEATHER_API_KEY}`, {
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
      console.log(result.weather[0].id);
      
      return res.json(result.weather[0].id);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};