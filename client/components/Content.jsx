import React, { useState, useRef } from 'react';
import { Line, Preview, PreviewAudio, Tracklist, Highlight, Focus, ResultListItem } from './styled-components.jsx';

const Content = (props) => {
  const { tracks, setUri } = props;
  const [song, setSong] = useState('https://p.scdn.co/mp3-preview/213ffa7ca413185c59a8811102048c07cd74494d?cid=b9efb41c90d4496dbb8c4fe19f0fc474');
  const [audioRef, setAudioref] = useState('');
  const [highlight, setHighlight] = useState('New Light');

  const loadSong = (track) => {
    setSong(track.preview_url);
    audioRef.load();
    setHighlight(track.name)
  };

  return (
    <>
      <Focus>Now Playing <Highlight>{highlight}</Highlight></Focus>
      <Tracklist>
      {tracks.map((track) => {
          return <><ResultListItem key={track.id} style={{cursor: 'pointer'}} onClick={()=>{loadSong(track); setUri(track.uri)}}>{track.name}</ResultListItem><br/></>;
      })}
      </Tracklist>
        <Preview>
          <PreviewAudio controls ref={(ref) => {setAudioref(ref)}}>
            <source src={song}></source>
          </PreviewAudio>
        </Preview>
    </>
  );
};

export default Content;