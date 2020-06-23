/* eslint-disable jsx-a11y/alt-text */
// LEGEND: ??? = explore further

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  GlobalStyle, Waveform, File, Form, PlayerDiv, Audio, Line, Download, CanvasBG, RenderBtn, FilePicker, RefHeader,
} from './styled-components.jsx';
import { drawAudio } from './Visualize.jsx';
import Search from './Search.jsx';
import Results from './Results.jsx';
import Content from './Content.jsx';
import Spotiphy from './Spotiphy.jsx';

const App = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext; // webkit for safari compatibility
  const audioContext = new AudioContext();

  const [init, setInit] = useState(true);
  const [song, setSong] = useState('./samples/sleepless.mp3');
  const [urlInput, setUrlinput] = useState('');
  const [audioRef, setAudioref] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [content, setContent] = useState([]);
  const [results, setResults] = useState([]);
  const [uri, setUri] = useState('spotify:track:12b3bKEbdjtL1Ga0n3ybzK');

  const getHashParams = () => {
    const hashParams = {};
    let e; const r = /([^&;=]+)=?([^&;]*)/g;
    const q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  };

  const params = getHashParams();
  const {
    access_token, refresh_token, login,
  } = params;

  const loadFile = () => {
    const file = document.getElementById('file').files[0];
    const objectUrl = URL.createObjectURL(file);
    setSong(objectUrl);
  };

  const urlChange = (e) => {
    e.preventDefault();
    setUrlinput(e.target.value);
  };

  const urlSubmit = (e) => {
    e.preventDefault();
    if (urlInput !== '') {
      setSong(urlInput);
    }
  };

  const loadSong = () => {
    audioRef.load();
  };

  const download = (e) => {
    const canvas = document.getElementById('waveform');
    // var png = image.toDataURL("image/png");
    // document.write('<img src="' + png + '"/>');
    canvas.toBlob((blob) => { // NATIVE HTML5
      const URLObj = window.URL || window.webkitURL;
      const a = document.createElement('a');
      a.href = URLObj.createObjectURL(blob);
      a.download = 'download.png'; // FILENAME TO BE USED
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const render = () => {
    drawAudio(song, audioContext);
    setInit(false);
    loadSong();
  };

  const searchArtist = (artist) => {
    axios.get('/searchArtist', {
      params: {
        name: artist,
        access_token,
      },
    })
      .then((data) => {
        setResults(data.data);
        setShowResults(true);
      })
      .catch((err) => console.error('An error occured'));
  };

  const loadTracks = (artistId) => {
    setShowResults(false);
    axios.get('/loadTracks', {
      params: {
        id: artistId,
        access_token,
      },
    })
      .then((res) => {
        setContent(res.data.tracks);
        setShowContent(true);
      })
      .catch((err) => console.error('An error occured', err)); // remove err
  };

  useEffect(() => {
    // drawAudio(song, audioContext);
  }, []);

  return (
    (!login) ? (<a href="/login">LOGIN TO SPOTIFY</a>)
      : (
        <>
          <GlobalStyle />
          <FilePicker>
            <File type="file" id="file" accept="audio/*" onChange={loadFile} onSubmit={urlSubmit} />
          </FilePicker>
          <Form onChange={urlChange} onSubmit={urlSubmit}>
            URL to Audio File&nbsp;
            <File type="text" id="url" />
            <RenderBtn onClick={render}>RENDER</RenderBtn>
          </Form>
          {(init) ? (<img src="dummy-wave.png" style={{ padding: '0.45rem 1rem .1rem 1rem' }} />)
            : (
              <CanvasBG id="canvas">
                <Waveform id="waveform" />
              </CanvasBG>
            )}
          <Line>
            <Download onClick={download}>Download Snapshot</Download>
            <PlayerDiv>
              {(init) ? <Audio controls /> : (
                <Audio controls ref={(ref) => { setAudioref(ref); }}>
                  <source src={song} />
                </Audio>
              )}
            </PlayerDiv>
          </Line>
          <RefHeader>REFERENCE</RefHeader>
          <Search searchArtist={searchArtist} />
          {(showResults) ? <Results results={results} loadTracks={loadTracks} /> : ''}
          {(showContent) ? <Content tracks={content} setUri={setUri} /> : ''}
          <Spotiphy id="spotiphy" song={uri} access_token={access_token} refresh_token={refresh_token} />
        </>
      )
  );
};

export default App;
