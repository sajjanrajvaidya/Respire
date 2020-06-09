import React from 'react';
import styles from 'styled-components';

export const Waveform = styles.canvas`
  display: inline-grid;
  width: 100%;
  height: 130px;
  margin: 2rem auto;
`;

export const File = styles.input`
  width: 30vw;
`;

export const FilePicker = styles.div`
  margin: 0rem 1rem 0rem 1rem;
`;

export const Form = styles.form`
  padding: 0.5rem 1rem 0rem 1rem;
`;

export const RenderBtn = styles.button`
  margin: 0rem 0rem 0rem 1rem;
`;

export const Download = styles.button`
  width: 15rem;
`;

export const PlayerDiv = styles.div`
  width: 100%;
  display: inline-grid;
  justify-content: center;
`;

export const Audio = styles.audio`
  display: inline-grid;
  height: 1.5rem;
  width: 50vw;
`;

export const PreviewAudio = styles.audio`
  display: inline;
  height: 1.5rem;
  width: 50vw;
`;

export const Preview = styles.div`
  display: flex;
  justify-content: center;
`;

export const Line = styles.div`
  display: inline-flex;
  padding-left: 1rem;
  padding-right: 1rem;
`;

export const CanvasBG = styles.div`
  background: #e8db35;
  margin: 0.5rem 1rem;
  box-sizing: content-box;
`;

export const ReferenceDiv = styles.div`
  padding: 1rem 1rem;
`;

export const SearchDiv = styles.div`
  padding: 1rem 1rem;
`;

export const ContentDiv = styles.div`
  padding: 0rem 1rem 1rem;
`;

export const ResultsDiv = styles.div`
  padding: 1rem 0rem;
  cursor: pointer;
  display: inline-flex;
`;

export const Thumbnail = styles.img`
  width: 10rem;
  height: 10rem;
`;

export const Tracklist = styles.div`
  padding: 1rem 1rem;
`;

export const Highlight = styles.span`
  font-weight: 700;
`;

export const Focus = styles.h3`
  padding: 0rem 1rem;
`;

export const Result = styles.div`
  padding: 1rem 1rem;
  width: 50%;
  cursor: pointer;
`;

export const ButtonsDock = styles.div`
  padding: 0rem 1rem;
`;

export const FullSongMessage = styles.div`
  padding: 0.5rem 0rem;
`;