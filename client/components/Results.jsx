import React, { useRef, useState } from 'react';
import { ResultsDiv, Thumbnail, Result } from './styled-components.jsx';

const Results = (props) => {
  const { results, loadTracks } = props;

  return (
    <ResultsDiv>
      {results.map((result) => {
        return (
          <Result key={result.id} onClick={() => {loadTracks(result.id)}}>
            {(result.images.length)?
              <Thumbnail src={result.images[0].url} />
              : <Thumbnail src='./square-fill.png' />}
              {' '}
              <br />
              <strong>{result.name}</strong>
          </Result>);
      })}
    </ResultsDiv>
  );
};

export default Results;