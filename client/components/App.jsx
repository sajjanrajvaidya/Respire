// LEGEND: ??? = explore further

import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Waveform, File, Form, PlayerDiv, Audio, Line, Download, CanvasBG, RenderBtn, FilePicker } from './styled-components.jsx';
import Search from './Search.jsx';
import Results from './Results.jsx';
import Content from './Content.jsx';
import Spotiphy from './Spotiphy.jsx';

const App = () => {
  window.AudioContext = window.AudioContext || window.webkitAudioContext; // webkit for safari compatibility
  const audioContext = new AudioContext();
  // let currentBuffer = null;

  const [song, setSong] = React.useState('./samples/sleepless.mp3');
  const [urlInput, setUrlinput] = useState('');
  const [audioRef, setAudioref] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [content, setContent] = useState([]);
  const [results, setResults] = useState([]);


  const drawAudio = (url) => {
    // HAVE TO USE FETCH IN THIS CASE
    // Using axios requires defining content-type and stringifying the data
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => draw(normalizeData(filterData(audioBuffer))))
      .catch((err) => {
        console.error('An error occured');
      })
  };

  const filterData = (audioBuffer) => {
    const rawData = audioBuffer.getChannelData(0); // flatten audio to 1 channel
    const samples = 10000; // desired number of samples in final data set
    const blockSize = Math.floor(rawData.length / samples); // number of samples in each sub-division
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // The location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[blockStart + j]); // sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // to get average for size of each data in sample
    };
    return filteredData;
  }

  //<< NORMALIZE THE DATA TO ADDRESS SMALL DATA POINTS >>//
  /*  Change the scale of the data so that the loudest samples measure as 1 */
  const normalizeData = (filteredData) => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier); // e.g. Max = 100, multiplier = 0.1; result = 1 i.e. scale all data according to the max value
  };

  //<< DRAW THE LINES BASED ON OUR DATA >>//
  const draw = normalizeData => {
    const canvas = document.getElementById("waveform"); // Allows to draw graphics into HTML <canvas> element
    const dpr = window.devicePixelRatio || 1; // check's browser's pixel ratio (basically screen resolution) to draw according to size
    const padding = 20;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = (canvas.offsetHeight + padding * 2) * dpr; // ???
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr); // ???
    ctx.translate(0, canvas.offsetHeight / 2 + padding); // Set Y = 0 to be in the middle of the canvas

    // DRAW THE LINE SEGMENTS
    const width = canvas.offsetWidth / normalizeData.length; // how wide each segment is
    for (let i = 0; i < normalizeData.length; i++) {
      const x = width * i;
      let height = normalizeData[i] * canvas.offsetHeight - padding;
      if (height < 0) {
        height = 0;
      } else if (height > canvas.offsetHeight / 2) {
        height = height > canvas.offsetHeight / 2; // may need change
      }
      drawLineSegment(ctx, x, height, width, (i + 1) % 2);
    }
  };

  const drawLineSegment = (ctx, x, height, width, isEven) => {
    ctx.lineWidth = 1; // thickness of line
    ctx.strokeStyle = '#2b6d67'; // color of line
    ctx.beginPath();
    height = isEven? height: -height; // ???
                       // keep me mind the negative value of y
    ctx.moveTo(x, 0); // moveTo move without drawing
    ctx.lineTo(x, height); // lineTo move while drawing
    ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven); // ???
    ctx.lineTo(x + width, 0);
    ctx.stroke();
  };

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
    var canvas = document.getElementById('waveform');
    // var png = image.toDataURL("image/png");
    // document.write('<img src="' + png + '"/>');
    canvas.toBlob((blob) => { // NATIVE HTML5
      let URLObj = window.URL || window.webkitURL;
      let a = document.createElement("a");
      a.href = URLObj.createObjectURL(blob);
      a.download = "download.png"; // FILENAME TO BE USED
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  };

  const render = () => {
    drawAudio(song);
    loadSong();
  };

  const searchArtist = (artist) => {
    axios.get('/searchArtist', {
      params: {
        name: artist,
      }
    })
    .then(data => {
      setResults(data.data);
      setShowResults(true);
    })
    .catch(err => console.error('An error occured'));
  }

  const loadTracks = (artistId) => {
    setShowResults(false);
    axios.get('/loadTracks', {
      params: {
        id: artistId,
      }
    })
    .then(res => {
      setContent(res.data.tracks);
      setShowContent(true);
    })
    .catch(err => console.error('An error occured', err)); // remove err
  };

  useEffect(() => {
    drawAudio(song);
  }, []);

    return (
      <>
        <FilePicker>
            <File type="file" id="file" accept="audio/*" onChange={loadFile} onSubmit={urlSubmit}></File>
        </FilePicker>
          <Form onChange={urlChange} onSubmit={urlSubmit}>
            URL to Audio File&nbsp;
            <File type="text" id="url"></File>
            <RenderBtn onClick={render}>RENDER</RenderBtn>
          </Form>
        <CanvasBG id="canvas">
          <Waveform id="waveform"></Waveform>
        </CanvasBG>
        <Line>
        <Download onClick={download}>Download Snapshot</Download>
          <PlayerDiv>
            <Audio controls ref={(ref) => {setAudioref(ref)}}>
              <source src={song}></source>
            </Audio>
          </PlayerDiv>
        </Line>
        <Search searchArtist={searchArtist}/>
        {(showResults)? <Results results={results} loadTracks={loadTracks}/> :''}
        {(showContent)? <Content tracks={content}/>:''}
        <Spotiphy />
      </>
    );
}

export default App;