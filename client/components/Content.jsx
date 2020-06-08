import React, { useRef, useState } from 'react';
import { ContentDiv } from './styled-components.jsx';

const Content = (props) => {
  const { name } = props.content;

  return (
    <ContentDiv>{name}</ContentDiv>
  );
};

export default Content;