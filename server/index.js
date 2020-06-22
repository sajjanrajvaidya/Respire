const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const config = require('../config');

const { id, secret, redirect } = config;
//
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring'); // note #1
var cookieParser = require('cookie-parser');

var client_id = id; // Your client id
var client_secret = secret; // Your secret
var redirect_uri = redirect; // Your redirect uri

const port = 8080;

const router = express.Router();

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, '../public')))
  .use(cors())
  .use(cookieParser())
  .use('/', router)
  .listen(port, () => {
    console.log(`Server is listening on port: ${ port }`);
  })

router.get('/searchArtist', (req, res) => {
  const { name } = req.query;

  // AN AXIOS REQUEST WITH HEADERS AND PARAMS
  axios.get('https://api.spotify.com/v1/search', {
    headers: {
      'Authorization': `Bearer ${config.auth}`,
    },
    params: {
      q: name,
      type: 'artist',
    }
  })
  .then(data => res.send(data.data.artists.items.slice(0, 3)))
  .catch((err) => {
    console.error('An error occured');
    res.send(400);
  });
})

router.get('/loadTracks', (req, res) => {
  const { id } = req.query;

  axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
    headers: {
      'Authorization': `Bearer ${config.auth}`,
    },
    params: {
      country: 'US',
    }
  })
  .then(data => res.send(data.data))
  .catch((err) => {
    console.error('An error occured', err);
    res.send(400);
  });
})

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

router.get('/login', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    }));
});

router.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  console.log('COOKIES: ', req.cookies, state)

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});