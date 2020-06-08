import React, { useRef } from 'react';
import { RenderBtn } from './styled-components.jsx';

const Reference = () => {

const search = useRef(null);

const handleSubmit = (e) => {
  e.preventDefault();
  let query = search.current.value;
  if (query !== '') {
    console.log(query);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="search-artist" ref={search}/>
      <RenderBtn>Search</RenderBtn>
    </form>
  );
};

export default Reference;