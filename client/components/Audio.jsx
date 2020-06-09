import React, { useEffect, useState } from 'react';

const Audio = ({ file }) => {

  const [song, setSong] = useState(file);

  useEffect(() => {
    setSong(file);
    console.log('Hey!', file);
  }, [file]);

  return (
  <audio controls>
    <source src={song} type="audio/*"></source>
  </audio>)
};

export default Audio;

// CHECK IF RELEVANT