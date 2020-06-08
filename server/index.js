const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const config = require('./config');

const port = 8080;

const router = express.Router();

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, '../public')))
  .use('/', router)
  .listen(port, () => {
    console.log(`Server is listening on port: ${ port }`);
  })

router.get('/getArtist', (req, res) => {
  const { name } = req.query;
  // const config = {
  //   method: 'get',
  //   url: `https://api.spotify.com/v1/search?q=${name}&type=artist`,
  //   headers: {
  //     'Authorization': config.auth,
  //   },
  // };

  // axios.get(`https://api.spotify.com/v1/search?q=${name}&type=artist`, {
  axios.get('https://api.spotify.com/v1/search', {
    headers: {
      'Authorization': config.auth,
    },
    params: {
      q: name,
      type: 'artist',
    }
  })
  .then(data => res.send(data.data.artists.items.slice(0, 3)))
  .catch((err) => {
    console.error('An error occured', err);
    res.send(400);
  }); // remove err from response
})