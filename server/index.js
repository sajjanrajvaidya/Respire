const express = require('express');
const path = require('path');

const app = express();
const axios = require('axios');
const config = require('../config');

const { id, secret, redirect } = config;
//
const request = require('request'); // "Request" library
const querystring = require('querystring'); // note #1
const cookieParser = require('cookie-parser');

const client_id = id; // Your client id
const client_secret = secret; // Your secret
const redirect_uri = redirect; // Your redirect uri

const port = 8080;

const router = express.Router();

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, '../public')))
  .use(cookieParser())
  .use('/', router)
  .listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });

router.get('/searchArtist', (req, res) => {
  const { name } = req.query;

  // AN AXIOS REQUEST WITH HEADERS AND PARAMS
  axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${config.auth}`,
    },
    params: {
      q: name,
      type: 'artist',
    },
  })
    .then((data) => res.send(data.data.artists.items.slice(0, 3)))
    .catch((err) => {
      console.error('An error occured');
      res.send(400);
    });
});

router.get('/loadTracks', (req, res) => {
  const { id } = req.query;

  axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
    headers: {
      Authorization: `Bearer ${config.auth}`,
    },
    params: {
      country: 'US',
    },
  })
    .then((data) => res.send(data.data))
    .catch((err) => {
      console.error('An error occured', err);
      res.send(400);
    });
});

const generateRandomString = function (length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-private user-read-email';
  res.redirect(`https://accounts.spotify.com/authorize?${
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    })}`);
});

router.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  console.log('COOKIES: ', req.cookies, state);

  if (state === null || state !== storedState) {
    res.redirect(`/#${
      querystring.stringify({
        error: 'state_mismatch',
      })}`);
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${new Buffer(`${client_id}:${client_secret}`).toString('base64')}`,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { access_token } = body;
        const { refresh_token } = body;

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: `Bearer ${access_token}` },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, body) => {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(`/#${
          querystring.stringify({
            access_token,
            refresh_token,
            login: true,
          })}`);
      } else {
        res.redirect(`/#${
          querystring.stringify({
            error: 'invalid_token',
          })}`);
      }
    });
  }
});
