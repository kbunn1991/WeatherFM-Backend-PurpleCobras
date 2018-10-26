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

Request Type: `POST`
URL: `https://weatherfm-client.herokuapp.com/api/login`

Required Request Headers: 
```
{
  Content-Type: `application/json`
}
```

Required Request JSON Body: 
```
{
  username: 'UsernameStringGoesHere',
  password: 'PasswordStringGoesHere'
}
```

Response Body will be a JSON Web Token: 
```
{
  authToken: 'theTokenWillBeHereAsAString'
}
```

* Note - Web Token is valid for 7 days from the issue date

#### Weather

##### Get Weather from Longitude and Latitude

Request Type: `GET`
Attach querie longituded and latitude to query string like this.

URL: `https://weatherfm-client.herokuapp.com/api/users/weather/${latitude}/${longitude}`

Required Request Headers: 
```
{
  Authorization: `Bearer ${authToken}`,
  content-type: `application/json`,
}
```

Sample Response Body: 
```
{
  weather: "Cloudy",
  tempC: "16",
  tempF: "61"
}
```

#### Playlists

##### Get Playlists for a User

Request Type: `GET`
Attach querie longituded and latitude to query string like this.

URL: `https://weatherfm-client.herokuapp.com/api/users/playlists`

Required Request Headers: 
```
{
  Authorization: `Bearer ${authToken}`,
  content-type: `application/json`,
}
```

Sample Response Body: 
```
{
  Sunny: [
   {
    artist: "Macklemore & Ryan Lewis",
    songTitle: "Thin Line",
    spotifyId: "77AB0zqvso8ALKUZ2HG2mG",
    thumbnail: "https://i.scdn.co/image/410191f75b2d2d48adb5a5d80d2acd09f811ff47",
    _id: "5bcf921d7a05f60015d2ee5b"
   },
   {
    artist: "Sickick",
    songTitle: "Mind Games",
    spotifyId: "21a1k8q3DJtsF8GorRfcL8",
    thumbnail: "https://i.scdn.co/image/4051cd9fb90462627f6be1a0ea1360014290ef86",
    _id: "5bcf921d7a05f60015d2ee5a",
  ],
  Drizzle: [],
  Rainy: [],
  Snowy: [],
  Thunderstorm: [],
  Cloudy: []
}
```

## Creators
Kaitlin Bunn, Brandon Graham, Kevin Tsang, Filipp Gorbunov, Ian Beihl
