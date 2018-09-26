const express = require('express');
const fetch = require('node-fetch');
const {WEATHER_API_KEY} = require('../config');

const User = require('../db/models/userSchema');

const router = express.Router();

router.get('/:lat/:lng', (req, res, next) => {
  const {lat, lng} = req.params;
  console.log(lat, lng, WEATHER_API_KEY);
  return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${WEATHER_API_KEY}`)
    .then(response => {
      console.log(response);
      console.log(response.text(), '----', response.json());
      // console.log(typeof JSON.parse(result), JSON.parse(result));
      console.log('Im sending back the result');
      res.json(response);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = {router};