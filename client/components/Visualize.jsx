export const filterData = (audioBuffer) => {
  const rawData = audioBuffer.getChannelData(0); // flatten audio to 1 channel
  const samples = 10000; // desired number of samples in final data set
  const blockSize = Math.floor(rawData.length / samples); // number of samples in each sub-division
  const filteredData = [];
  for (let i = 0; i < samples; i++) {
    const blockStart = blockSize * i; // The location of the first sample in the block
    let sum = 0;
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[blockStart + j]); // sum of all the samples in the block
    }
    filteredData.push(sum / blockSize); // to get average for size of each data in sample
  }
  return filteredData;
};

export const normalizeData = (filteredData) => {
  // eslint-disable-next-line no-restricted-properties
  const multiplier = Math.pow(Math.max(...filteredData), -1);
  return filteredData.map((n) => n * multiplier); // e.g. Max = 100, multiplier = 0.1; result = 1 i.e. scale all data according to the max value
};

export const drawLineSegment = (ctx, x, height, width, isEven) => {
  ctx.lineWidth = 1; // thickness of line
  ctx.strokeStyle = '#2b6d67'; // color of line
  ctx.beginPath();
  height = isEven ? height : -height; // ???
  // keep me mind the negative value of y
  ctx.moveTo(x, 0); // moveTo move without drawing
  ctx.lineTo(x, height); // lineTo move while drawing
  ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven); // ???
  ctx.lineTo(x + width, 0);
  ctx.stroke();
};

// eslint-disable-next-line no-shadow
export const draw = (normalizeData) => {
  const canvas = document.getElementById('waveform'); // Allows to draw graphics into HTML <canvas> element
  const dpr = window.devicePixelRatio || 1; // check's browser's pixel ratio (basically screen resolution) to draw according to size
  const padding = 20;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = (canvas.offsetHeight + padding * 2) * dpr; // ???
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr); // ???
  ctx.translate(0, canvas.offsetHeight / 2 + padding); // Set Y = 0 to be in the middle of the canvas

  // DRAW THE LINE SEGMENTS
  const width = canvas.offsetWidth / normalizeData.length; // how wide each segment is
  for (let i = 0; i < normalizeData.length; i++) {
    const x = width * i;
    let height = normalizeData[i] * canvas.offsetHeight - padding;
    if (height < 0) {
      height = 0;
    } else if (height > canvas.offsetHeight / 2) {
      height = height > canvas.offsetHeight / 2; // may need change
    }
    drawLineSegment(ctx, x, height, width, (i + 1) % 2);
  }
};

export const drawAudio = (url, audioContext) => {
  // HAVE TO USE FETCH IN THIS CASE
  // Using axios requires defining content-type and stringifying the data
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    // eslint-disable-next-line no-use-before-define
    .then((audioBuffer) => draw(normalizeData(filterData(audioBuffer))))
    .catch((err) => {
      console.error('An error occured', err);
    });
};
