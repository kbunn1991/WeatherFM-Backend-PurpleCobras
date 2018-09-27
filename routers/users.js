
const express = require('express');
const bodyParser = require('body-parser');

const User = require('../db/models/userSchema');

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to register a new user
router.post('/', jsonParser, (req, res) => {
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

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
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
      min: 8,
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

  let {username, password, firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

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
          Sunny: [
            {
              artist: 'Bill Withers',
              songTitle: 'Lovely Day',
              thumbnail: 'https://i.scdn.co/image/c8977ed4a277af7cad24a7d3944867dc502d0ded',
            },
            {
              artist: 'The Temper Trap',
              songTitle: 'Sweet Disposition',
              thumbnail: 'https://i.scdn.co/image/db7c8bb866f7ac10f60deb01ec23079627633092',
            },
            {
              artist: 'Logic',
              songTitle: 'Ballin',
              thumbnail: 'https://i.scdn.co/image/1b776e10861ecf8910b6cf9b8d8eed3d07b21b1d',
            },
            {
              artist: 'Washed Out',
              songTitle: 'It All Feels Right',
              thumbnail: 'https://i.scdn.co/image/7b878d124b070b09af63b7f1c7ac8b0397d81984',
            },
            {
              artist: 'Grateful Dead',
              songTitle: 'Franklin\'s Tower - 2006 Remastered Version',
              thumbnail: 'https://i.scdn.co/image/9dc927f2916a646fd8201189173cc41adead286f',
            }
          ],
          Rainy: [
            {
              artist: 'Other Lives',
              songTitle: 'Black Tables',
              thumbnail: 'https://i.scdn.co/image/e7f2d0de29ae90afd6d9e85ecb76e985f273e7c0',
            },
            {
              artist: 'Whisperer',
              songTitle: 'Currents',
              thumbnail: 'https://i.scdn.co/image/b542fbd174e57c0a47c09ae54328d28061839422',
            },
            {
              artist: 'Lauv',
              songTitle: 'Paris in the Rain',
              thumbnail: 'https://i.scdn.co/image/2302c853ddab4bda9aa9cb89d5012d26ed67bffc',
            },
            {
              artist: 'FVHM',
              songTitle: 'Cutting Ties - FVHM Remix',
              thumbnail: 'https://i.scdn.co/image/38c46cd0a069d22142bb1a1ec63ea50c74361d55',
            },
            {
              artist: 'The Olympians',
              songTitle: 'Sirens of Jupiter',
              thumbnail: 'https://i.scdn.co/image/94660be6fd94f77011fa91de6d2f770130a48166',
            }
          ],
          Drizzle: [
            {
              artist: 'Young the Giant',
              songTitle: 'Firelight',
              thumbnail: 'https://i.scdn.co/image/91a92892cfeefad2159ddf831a0d868157a487c4',
            },
            {
              artist: 'Keaton Henson',
              songTitle: 'Petrichor',
              thumbnail: 'https://i.scdn.co/image/727ffeeec9b246ff9cbbfb48f445c4dbe03333b1',
            },
            {
              artist: 'Claude Debussy',
              songTitle: 'Clair de Lune, L. 32',
              thumbnail: 'https://i.scdn.co/image/b5e5b27c53dcbbb51d6ff7771f37d5b7d4e84237',
            },
            {
              artist: 'Janelle Monáe',
              songTitle: 'Neon Valley Street',
              thumbnail: 'https://i.scdn.co/image/15ffdac00dfe71e920a7f6d7bf784dc0f038f8e9',
            },
            {
              artist: 'The Allman Brothers Band',
              songTitle: 'Stormy Monday - Live At The Fillmore East/1971',
              thumbnail: 'https://i.scdn.co/image/0e811101c144c664973d157aa7b935aa3acab132',
            }
          ],
          Snowy: [
            {
              artist: 'Ella Fitzgerald',
              songTitle: 'Baby Its Cold Outside',
              thumbnail: 'https://i.scdn.co/image/f78e02b431565892fe10fa33a5dce0dfe49426c4'
            },
            {
              artist: 'Gyvus',
              songTitle: 'Tozen',
              thumbnail: 'https://i.scdn.co/image/6edb99796a0ba9f51f8b9c18969bf7cf547a6a59'
            },
            {
              artist: 'The Neighbourhood',
              songTitle: 'Sweater Weather',
              thumbnail: 'https://i.scdn.co/image/ff91ad86bcd7fe6825c1b82fe74a7db4a8dd4b97'
            },
            {
              artist: 'Art Pepper',
              songTitle: 'You Go To My Head',
              thumbnail: 'https://i.scdn.co/image/ac967ca6ac2782405a8832a710430967424d44e3'
            },
            {
              artist: 'The Doors',
              songTitle: 'Riders On The Storm',
              thumbnail: 'https://i.scdn.co/image/387d03c05bb0d7a201553de7e66b09600a69d2f8'
            }
          ],
          Cloudy: [
            {
              artist: 'Macklemore & Ryan Lewis',
              songTitle: 'Thin Line',
              thumbnail: 'https://i.scdn.co/image/410191f75b2d2d48adb5a5d80d2acd09f811ff47'
            },
            {
              artist: 'Sickick',
              songTitle: 'Mind Games',
              thumbnail: 'https://i.scdn.co/image/4051cd9fb90462627f6be1a0ea1360014290ef86'
            },
            {
              artist: 'Vivaldi',
              songTitle: 'The Seasons’ Four Concertos, Op.8, Winter, in F Minor , Part 1',
              thumbnail: 'https://i.scdn.co/image/b0b4d45e55e0fea75ae14f1958ce548a0731a439'
            },
            {
              artist: 'Wiz Khalifa',
              songTitle: 'Mezmorized',
              thumbnail: 'https://i.scdn.co/image/3409c1ad9636eda6f75c38f4a261a4ddf25ac6f1'
            },
            {
              artist: 'Emancipator',
              songTitle: 'Greenland',
              thumbnail: 'https://i.scdn.co/image/928cbfcec230a5f09f2d2a7d96916c89b293d70c'
            }
          ],
          Thunderstorm: [ 
            {
              artist: 'Cage The Elephant',
              songTitle: 'Shake Me Down',
              thumbnail: 'https://i.scdn.co/image/5959b928589064dd7af767ad4d4c87da57a9d6cc'
            },
            {
              artist: 'OneRepublic',
              songTitle: 'Lets Hurt Tonight',
              thumbnail: 'https://i.scdn.co/image/3af30ea172ff0db16edfcbcc7b2256896f365460'
            },
            {
              artist: 'Joyner Lucas',
              songTitle: 'Im Not Racist',
              thumbnail: 'https://i.scdn.co/image/155b9f5d48112b13ac04c1024750c4c968898a32'
            },
            {
              artist: 'Modern Rock Heroes',
              songTitle: 'Monsoon',
              thumbnail: 'https://i.scdn.co/image/5e232e9475674da1aa65b00ef856065d8d78acf0'
            },
            {
              artist: 'Santana',
              songTitle: 'Soul Sacrifice',
              thumbnail: 'https://i.scdn.co/image/686c62d028075763b76e32235d1834fc8fa4ef1b'
            }
          ]
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
      res.status(500).json({code: 500, message: 'This internal server error'});
    });
    
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user)))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


module.exports = {router};
