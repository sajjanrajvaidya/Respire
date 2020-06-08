import React, { useRef, useState } from 'react';
import { SearchDiv, RenderBtn } from './styled-components.jsx';

const Search = (props) => {

const { searchArtist } = props;

const search = useRef(null);

const handleSubmit = (e) => {
  e.preventDefault();
  let query = search.current.value;
  if (query !== '') {
    searchArtist(query);
  }
  search.current.value = '';
};

  return (
    <>
      <SearchDiv>
        <form onSubmit={handleSubmit}>
          <input type="text" name="search-artist" ref={search}/>
          <RenderBtn>Search Artist</RenderBtn>
        </form>
      </SearchDiv>
    </>
  );
};

export default Search;