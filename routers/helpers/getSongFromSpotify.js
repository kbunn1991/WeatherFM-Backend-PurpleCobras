const fetch = require('node-fetch');

const getSongFromSpotify = function (arr, resolve, accessToken){
  const promises = arr.map(item => {
    // console.log(item);
    let songDetails = 'https://api.spotify.com/v1/search?type=track' + 
    `&limit=1&q=${item.songTitle}+${item.artist}`;
    // console.log(songDetails, '-----------------');
    return fetch(songDetails, 
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(response => {
        return response.json();
      })
      .then(response => {
        // console.log(response, '!!!!!!!!!!!!!!!!!!!!!!!');
        if(!response.tracks.items.length){
          return({ 
            message: 'Invalid song.',
            artist: `${item.artist}`,
            songTitle: `${item.songTitle}`});
        }
        // console.log(response.tracks.items, 'spotify response');
        else{
          if(response.tracks.items[0]){
            return ({
              spotifyId: response.tracks.items[0].id,
              artist: response.tracks.items[0].artists[0].name,
              songTitle: response.tracks.items[0].name,
              thumbnail: response.tracks.items[0].album.images[0].url           
            });
          }
        }
      });
  });
  Promise.all(promises)
    .then(result => {
      resolve(result);
    });
};

module.exports = getSongFromSpotify;