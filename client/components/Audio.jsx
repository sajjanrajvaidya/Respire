import React, { useEffect, useState } from 'react';

const Audio = ({ file }) => {
  const [song, setSong] = useState(file);

  useEffect(() => {
    setSong(file);
  }, [file]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio controls>
      <source src={song} type="audio/*" />
    </audio>
  );
};

export default Audio;
