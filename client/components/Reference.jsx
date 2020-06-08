import React, { useRef, useState } from 'react';
import { ReferenceDiv, RenderBtn } from './styled-components.jsx';
import Content from './Content.jsx';

const Reference = (props) => {

const { searchArtist } = props;

const [content, setContent] = useState({name: 'John Mayer', age: 40});
const search = useRef(null);

const handleSubmit = (e) => {
  e.preventDefault();
  let query = search.current.value;
  if (query !== '') {
    searchArtist(query);
  }
};

  return (
    <>
      <ReferenceDiv>
        <form onSubmit={handleSubmit}>
          <input type="text" name="search-artist" ref={search}/>
          <RenderBtn>Search Artist</RenderBtn>
        </form>
      </ReferenceDiv>
      {(Object.keys(content).length > 0)? <Content content={ content } />: ''}
    </>
  );
};

export default Reference;