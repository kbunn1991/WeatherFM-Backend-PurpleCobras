# WeatherFM
A playlist app that generates mood music based on the weather in your area ☀️🎶⛅🎶☁️
[![npm version](https://badge.fury.io/js/node.svg)](https://badge.fury.io/js/node)
[![Build Status](https://www.travis-ci.org/thinkful-ei22/WeatherFM-Backend-PurpleCobras.png)](https://www.travis-ci.org/thinkful-ei22/WeatherFM-Backend-PurpleCobras)

## Link to deployed version on Heroku:
https://weatherfm-client.herokuapp.com/

## Tech Stack
WeatherFM uses React.js, Enzyme/Jest for the client, and Node.js, MongoDB, Mongoose, Mocha/Chai for the backend.  WeatherFM also utilizes, Spotify, Youtube and OpenWeather's external APIs. 
 
### API Documentation

#### Authorization

##### Request a JSON Web Token 

* Request Type: `POST`

* URL: `https://weatherfm-client.herokuapp.com/api/login`

* Required Request Headers: 
```
{
  Content-Type: `application/json`
}
```

* Required Request JSON Body: 
```
{
  username: 'UsernameStringGoesHere',
  password: 'PasswordStringGoesHere'
}
```

* Response Body will be a JSON Web Token: 
```
{
  authToken: 'theTokenWillBeHereAsAString'
}
```

* Note - Web Token is valid for 7 days from the issue date

## Creators
Kaitlin Bunn, Brandon Graham, Kevin Tsang, Filipp Gorbunov, Ian Beihl
