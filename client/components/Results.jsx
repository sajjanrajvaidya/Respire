import React, { useRef, useState } from 'react';
import { ResultsDiv, Thumbnail } from './styled-components.jsx';

const Results = (props) => {
  const { results, loadTracks } = props;

  const loadTrackNames = (id) => {
    loadTracks(id);
  };

  return (
    <ResultsDiv>
      {results.map((result) => {
        return (
          <div key={result.id} onClick={() => {loadTracks(result.id)}}>
            {result.name}
            {' '}
            {result.genres[result.genres.length - 1]}
            {' '}
            {(result.images.length)?
              <Thumbnail src={result.images[0].url} />
              : '[Thumbnail Not Available]'}
          </div>);
      })}
    </ResultsDiv>
  );
};

export default Results;