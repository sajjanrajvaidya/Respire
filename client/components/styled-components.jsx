import React from 'react';
import styles from 'styled-components';

export const Waveform = styles.canvas`
  display: inline-grid;
  width: 100%;
  height: 130px;
  margin: 2rem auto;
`;

export const File = styles.input``;

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