# WeatherFM
A playlist app that generates mood music based on the weather in your area ☀️🎶⛅🎶☁️
[![Build Status](https://www.travis-ci.org/thinkful-ei22/WeatherFM-Backend-PurpleCobras.png)](https://www.travis-ci.org/thinkful-ei22/WeatherFM-Backend-PurpleCobras)

## Link to deployed version on Heroku:
https://weatherfm-client.herokuapp.com/

## Features

### Discover
After creating an account, a user can either let WeatherFM access their location, or can enter a city or zipcode to get the weather at their location.  The discover feature allows users to get custom spotify playlists that reflect the weather.  While on the discover page, users can choose to add a song to that specific weather playlist, go the next song or the previous song.  There are also advanced settings that allow the user to tweak the discover songs by adjusting song attributes like happiness, popularity and danceability.

### Playlists
While listening to the discover page, users can add songs to their own individual playlists.  When a user is on the playlists page, they can choose a weather playlist, add, remove and play songs from it.  We have also further integrated WeatherFM with Spotify, so  for users with a spotify account, they can login into their account from WeatherFM and export their custom weather playlists to their Spotify account.

### Customization
Regardless of a users location or the current weather, they can access all of their different weather playlists as well as use the discover feature.  By changing the current weather, users can generate rainy day playlists when its sunny outside.  Similarly, if a user does not want to share their location, or wants to discover music based on another location's weather, they can change their location by entering the city or zipcode of a location in the header bar.

## Screenshots
### Discover Page

### Playlist Page

### Login

### Registration


## Target Audience
Any looking to find music that reflects nature's mood.

## Tech Stack
WeatherFM uses React.js, Enzyme for the client, and Node.js, MongoDB, Mongoose, Mocha/Chai for the backend. 

## Future Plans
We would like to change our music player, so instead of playing youtube videos, our discover and playlist pages just play audio.

## Creators
Kaitlin Bunn, Brandon Graham, Kevin Tsang, Filipp Gorbunov, Ian Beihl