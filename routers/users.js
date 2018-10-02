
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const {SPOTIFY_KEY_64} = require('../config');

const User = require('../db/models/userSchema');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
router.post('/', jsonParser, (req, res, next) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: `Missing '${missingField}' in request body`,
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 6,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {
    username, 
    password, 
    firstName = '', 
    Sunny, 
    Rainy, 
    Drizzle, 
    Snowy,
    Cloudy, 
    Thunderstorm} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  let accessToken;
  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded',
      Authorization: `Basic ${SPOTIFY_KEY_64}`
    },
    body: 'grant_type=client_credentials'
  })
    .then(result => {
      result = result.json();
      return result;
    })
    .then(result => {
      accessToken = result.access_token;
      if(Sunny.length === 0) {
        Sunny = [
          { 
            id: '0bRXwKfigvpKZUurwqAlEh',
            artist: 'Bill Withers',
            songTitle: 'Lovely Day',
            thumbnail: 'https://i.scdn.co/image/c8977ed4a277af7cad24a7d3944867dc502d0ded',
          },
          {
            id: '5RoIXwyTCdyUjpMMkk4uPd',
            artist: 'The Temper Trap',
            songTitle: 'Sweet Disposition',
            thumbnail: 'https://i.scdn.co/image/db7c8bb866f7ac10f60deb01ec23079627633092',
          },
          {
            id: '17N5FdRwJuv3UXQ7MHnbhF',
            artist: 'Logic',
            songTitle: 'Ballin',
            thumbnail: 'https://i.scdn.co/image/1b776e10861ecf8910b6cf9b8d8eed3d07b21b1d',
          },
          {
            id: '0Z7S8ity4SYlkzbJpejd1v',
            artist: 'Washed Out',
            songTitle: 'It All Feels Right',
            thumbnail: 'https://i.scdn.co/image/7b878d124b070b09af63b7f1c7ac8b0397d81984',
          },
          {
            id: '6wmzz9dCztW1zgNXrZIyw8',
            artist: 'Grateful Dead',
            songTitle: 'Franklin\'s Tower - 2006 Remastered Version',
            thumbnail: 'https://i.scdn.co/image/9dc927f2916a646fd8201189173cc41adead286f',
          }
        ];
      }
      else {
        Sunny = Sunny.map(item => {
          let songDetails = `https://api.spotify.com/v1/search?type=track&limit=1&q=${item.songTitle}+${item.artist}`;
          fetch(songDetails, 
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            .then(result => {
              console.log(result.tracks);
              if(result.tracks.items.length !== 0){
                return ({
                  id: result.tracks.items[0].id,
                  artist: result.tracks.items[0].artists[0].name,
                  songTitle: result.tracks.items[0].name,
                  thumbnail: result.tracks.items[0].album.images[0].url           
                });
              }
            });
        });
      }
  
      if(Rainy.length === 0) {
        Rainy = [
          {
            id: '3ZomZOKK49bjGzeNq5fi35',
            artist: 'Other Lives',
            songTitle: 'Black Tables',
            thumbnail: 'https://i.scdn.co/image/e7f2d0de29ae90afd6d9e85ecb76e985f273e7c0',
          },
          {
            id: '11jzYQcFcGpjXlTWVghPCI',
            artist: 'Whisperer',
            songTitle: 'Currents',
            thumbnail: 'https://i.scdn.co/image/b542fbd174e57c0a47c09ae54328d28061839422',
          },
          {
            id: '41CgzGD7xlgnJe14R4cqkL',
            artist: 'Lauv',
            songTitle: 'Paris in the Rain',
            thumbnail: 'https://i.scdn.co/image/2302c853ddab4bda9aa9cb89d5012d26ed67bffc',
          },
          {
            id: '6MPB8398c9UmGCOes0eg7A',
            artist: 'FVHM',
            songTitle: 'Cutting Ties - FVHM Remix',
            thumbnail: 'https://i.scdn.co/image/38c46cd0a069d22142bb1a1ec63ea50c74361d55',
          },
          {
            id: '2yM6bVAkaJP5YzTBlAgUbK',
            artist: 'The Olympians',
            songTitle: 'Sirens of Jupiter',
            thumbnail: 'https://i.scdn.co/image/94660be6fd94f77011fa91de6d2f770130a48166',
          }
        ];
      } 
      else {
        Rainy = Rainy.map(item => {
          let songDetails = `https://api.spotify.com/v1/search?type=track&limit=1&q=${item.songTitle}+${item.artist}`;
          fetch(songDetails, 
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            .then(result => {
              console.log(result.tracks);
              if(result.tracks.items.length !== 0){
                return ({
                  id: result.tracks.items[0].id,
                  artist: result.tracks.items[0].artists[0].name,
                  songTitle: result.tracks.items[0].name,
                  thumbnail: result.tracks.items[0].album.images[0].url           
                });
              }
            });
        });
      }
  
      if(Drizzle.length === 0) {
        Drizzle = [
          {
            id: '2bBQg0zLuhXcVvqSSriawP',
            artist: 'Young the Giant',
            songTitle: 'Firelight',
            thumbnail: 'https://i.scdn.co/image/91a92892cfeefad2159ddf831a0d868157a487c4',
          },
          {
            id: '1RWRfknqqgTNNPO1EoP7Wo',
            artist: 'Keaton Henson',
            songTitle: 'Petrichor',
            thumbnail: 'https://i.scdn.co/image/727ffeeec9b246ff9cbbfb48f445c4dbe03333b1',
          },
          {
            id: '5u5aVJKjSMJr4zesMPz7bL',
            artist: 'Claude Debussy',
            songTitle: 'Clair de Lune, L. 32',
            thumbnail: 'https://i.scdn.co/image/b5e5b27c53dcbbb51d6ff7771f37d5b7d4e84237',
          },
          {
            id: '1N49dCsfnMv00ezWlKdEGn',
            artist: 'Janelle Monáe',
            songTitle: 'Neon Valley Street',
            thumbnail: 'https://i.scdn.co/image/15ffdac00dfe71e920a7f6d7bf784dc0f038f8e9',
          },
          {
            id: '0bKWn6sAxH8fSOAgS8z8t6',
            artist: 'The Allman Brothers Band',
            songTitle: 'Stormy Monday - Live At The Fillmore East/1971',
            thumbnail: 'https://i.scdn.co/image/0e811101c144c664973d157aa7b935aa3acab132',
          }
        ];
      }
      else {
        Drizzle = Drizzle.map(item => {
          let songDetails = `https://api.spotify.com/v1/search?type=track&limit=1&q=${item.songTitle}+${item.artist}`;
          fetch(songDetails, 
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            .then(result => {
              console.log(result.tracks);
              if(result.tracks.items.length !== 0){
                return ({
                  id: result.tracks.items[0].id,
                  artist: result.tracks.items[0].artists[0].name,
                  songTitle: result.tracks.items[0].name,
                  thumbnail: result.tracks.items[0].album.images[0].url           
                });
              }
            });
        });
      }
  
      if(Snowy.length === 0) {
        Snowy = [
          {
            id: '3Nx6iu7XpzWL1QMPRJKzqL',
            artist: 'Ella Fitzgerald',
            songTitle: 'Baby Its Cold Outside',
            thumbnail: 'https://i.scdn.co/image/f78e02b431565892fe10fa33a5dce0dfe49426c4'
          },
          {
            id: '4gav2anVlQ5woM8KH37zpu',
            artist: 'Gyvus',
            songTitle: 'Tozen',
            thumbnail: 'https://i.scdn.co/image/6edb99796a0ba9f51f8b9c18969bf7cf547a6a59'
          },
          {
            id: '2QjOHCTQ1Jl3zawyYOpxh6',
            artist: 'The Neighbourhood',
            songTitle: 'Sweater Weather',
            thumbnail: 'https://i.scdn.co/image/ff91ad86bcd7fe6825c1b82fe74a7db4a8dd4b97'
          },
          {
            id: '4ymHy4hzJ09WxvvT7p0Azy',
            artist: 'Art Pepper',
            songTitle: 'You Go To My Head',
            thumbnail: 'https://i.scdn.co/image/ac967ca6ac2782405a8832a710430967424d44e3'
          },
          {
            id: '5j5VvsEHLlWT6IaEKSGDj9',
            artist: 'The Doors',
            songTitle: 'Riders On The Storm',
            thumbnail: 'https://i.scdn.co/image/387d03c05bb0d7a201553de7e66b09600a69d2f8'
          }
        ];
      }
      else {
        Snowy = Snowy.map(item => {
          let songDetails = `https://api.spotify.com/v1/search?type=track&limit=1&q=${item.songTitle}+${item.artist}`;
          fetch(songDetails, 
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            .then(result => {
              console.log(result.tracks);
              if(result.tracks.items.length !== 0){
                return ({
                  id: result.tracks.items[0].id,
                  artist: result.tracks.items[0].artists[0].name,
                  songTitle: result.tracks.items[0].name,
                  thumbnail: result.tracks.items[0].album.images[0].url           
                });
              }
            });
        });
      }
  
      if(Cloudy.length === 0) {
        Cloudy = [
          {
            id: '77AB0zqvso8ALKUZ2HG2mG',
            artist: 'Macklemore & Ryan Lewis',
            songTitle: 'Thin Line',
            thumbnail: 'https://i.scdn.co/image/410191f75b2d2d48adb5a5d80d2acd09f811ff47'
          },
          {
            id: '21a1k8q3DJtsF8GorRfcL8',
            artist: 'Sickick',
            songTitle: 'Mind Games',
            thumbnail: 'https://i.scdn.co/image/4051cd9fb90462627f6be1a0ea1360014290ef86'
          },
          {
            id: '4kzyhn8i6Hf8daEBqNPfCy',
            artist: 'Jaymes Young',
            songTitle: 'Moondust',
            thumbnail: 'https://i.scdn.co/image/14a9ad089a7bf71f119fd88ea92c18434517b955'
          },
          {
            id: '3tzD0EbTZZwUzVmab9RCYT',
            artist: 'Lovers Rock',
            songTitle: 'Sade',
            thumbnail: 'https://i.scdn.co/image/ae0ce75e760b8eed7cbfc4d73a5875886289aa35'
          },
          {
            id: '2SPTGg9SC5MT1FwNX4IYfx',
            artist: 'Emancipator',
            songTitle: 'Greenland',
            thumbnail: 'https://i.scdn.co/image/928cbfcec230a5f09f2d2a7d96916c89b293d70c'
          }
        ];
      }
      else {
        Cloudy = Cloudy.map(item => {
          let songDetails = `https://api.spotify.com/v1/search?type=track&limit=1&q=${item.songTitle}+${item.artist}`;
          fetch(songDetails, 
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            .then(result => {
              console.log(result.tracks);
              if(result.tracks.items.length !== 0){
                return ({
                  id: result.tracks.items[0].id,
                  artist: result.tracks.items[0].artists[0].name,
                  songTitle: result.tracks.items[0].name,
                  thumbnail: result.tracks.items[0].album.images[0].url           
                });
              }
            });
        });
      }
  
      if(Thunderstorm.length === 0) {
        Thunderstorm = [ 
          {
            id: '12sYWro0wGQpq0rjE0lKcm',
            artist: 'Cage The Elephant',
            songTitle: 'Shake Me Down',
            thumbnail: 'https://i.scdn.co/image/5959b928589064dd7af767ad4d4c87da57a9d6cc'
          },
          {
            id: '05sCp83gcMm1iecYydKJS3',
            artist: 'OneRepublic',
            songTitle: 'Lets Hurt Tonight',
            thumbnail: 'https://i.scdn.co/image/3af30ea172ff0db16edfcbcc7b2256896f365460'
          },
          {
            id: '0hL8yBivUahlm1rhQ1a0Xx',
            artist: 'Joyner Lucas',
            songTitle: 'Im Not Racist',
            thumbnail: 'https://i.scdn.co/image/155b9f5d48112b13ac04c1024750c4c968898a32'
          },
          {
            id: '2Tgj50GmYGlswjb97lxiAf',
            artist: 'Modern Rock Heroes',
            songTitle: 'Monsoon',
            thumbnail: 'https://i.scdn.co/image/5e232e9475674da1aa65b00ef856065d8d78acf0'
          },
          {
            id: '4e0GkgtMPZFt41Ua8PlHQL',
            artist: 'Santana',
            songTitle: 'Soul Sacrifice',
            thumbnail: 'https://i.scdn.co/image/686c62d028075763b76e32235d1834fc8fa4ef1b'
          }
        ];
      }
      else {
        Thunderstorm = Thunderstorm.map(item => {
          let songDetails = `https://api.spotify.com/v1/search?type=track&limit=1&q=${item.songTitle}+${item.artist}`;
          fetch(songDetails, 
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            })
            .then(result => {
              console.log(result.tracks);
              if(result.tracks.items.length !== 0){
                return ({
                  id: result.tracks.items[0].id,
                  artist: result.tracks.items[0].artists[0].name,
                  songTitle: result.tracks.items[0].name,
                  thumbnail: result.tracks.items[0].album.images[0].url           
                });
              }
            });
        });
      }
    });

  User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        playlists: {
          Sunny,
          Rainy,
          Drizzle,
          Snowy,
          Cloudy,
          Thunderstorm
        }
      });
    })
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      next(err);
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res, next) => {
  return User.find()
    .then(users => res.json(users.map(user => user)))
    .catch(err => {
      next(err);
    });
});

module.exports = {router};
