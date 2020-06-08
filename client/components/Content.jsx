import React from 'react';

const Content = (props) => {
  const { tracks } = props;

  return (
    <>{tracks.map((track) => {
        console.log(track);
        return <li key={track.id}>{track.name}</li>;
    })}</>
  );
};

export default Content;