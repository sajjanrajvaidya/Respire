// SPOTIFY WEB PLAYER DEALS WITH AUTHORIZATION TOKEN AND NOT ACCESS TOKEN (WHICH IS SERVER-SIDE)
const auth = require('../../config.js').auth;
import React from 'react';
import Script from 'react-load-script'; // HELPS CREATE A SCRIPT TAG ONTO INDEX.HTML"
import axios from 'axios';
import { ButtonsDock, FullSongMessage } from './styled-components.jsx';

let songUri = 'spotify:track:12b3bKEbdjtL1Ga0n3ybzK';
let device = '';
let position = null;

const Spotiphy = ({ song }) => {
  if (song !== undefined) {
    songUri = song;
  }

  const play = (device_id, auth, uri) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [uri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth}`
      },
    });
  }

  const loadPlayer =() => {
  window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({ // WHAT IS THIS DOING?
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(auth); },
      volume: 0.5,
    });

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => { // addListener returns an object
      console.log('Ready with Device ID', device_id);
      device = device_id;
    });

    // Not Ready; MORE ERROR HANDLING
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
  }
};


const playSong = () => {
  play(device, auth, songUri);
};

const pauseSong = () => {
  axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${device}`, {}, {
    headers: {
      Authorization: `Bearer ${auth}`,
    }
  })
  .catch(err => console.error('An error occured'));
};

const seek = () => {
  position = (position)? position += 30000: 30000;
  axios.put(`https://api.spotify.com/v1/me/player/seek?device_id=${device}`,{}, {
    params: {
      position_ms: position,
    },
    headers: {
      Authorization: `Bearer ${auth}`,
    }
  })
  .catch(err => console.error('An error occured'));
};

const rewind = () => {
  position = (position > 0)? ((position >= 30000)? position -= 30000: 0): 0;
  axios.put(`https://api.spotify.com/v1/me/player/seek?device_id=${device}`,{}, {
    params: {
      position_ms: position,
    },
    headers: {
      Authorization: `Bearer ${auth}`,
    }
  })
  .catch(err => console.error('An error occured'));
};

  return (
    <>
    <Script url="https://sdk.scdn.co/spotify-player.js"
        onCreate={() => console.log('Script tag created')}
        onLoad={loadPlayer}
        onError={(err) => console.error('Could not connect to Spotify', err)} // remove err
    />

    <a href="/login">LOG IN</a>

    <ButtonsDock>
      <FullSongMessage id="full-song-message">Play Full Track</FullSongMessage>
      <button onClick={playSong}>Play</button>
      <button onClick={pauseSong}>Pause</button>
      <button onClick={seek}>Seek Forward</button>
      <button onClick={rewind}>Rewind</button>
    </ButtonsDock>
    </>
  );
};

export default Spotiphy;

