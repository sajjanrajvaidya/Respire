import React from 'react';

const App = () => {

    // MAIN AUDIO
    var audio = new Audio();
    audio.src = './samples/sleepless.mp3';
    audio.controls = true;

    var canvas, ctx, source, context, analyser, fbc_array, bar_x, bar_width, bar_height;

    const initPlayer = () => {
      document.getElementById('audio_box').appendChild(audio);
      context = new AudioContext(); // audio context object instance
      analyser = context.createAnalyser(); // AnalyserNode method

      canvas = document.getElementById('analyser_render');
      ctx = canvas.getContext('2d'); // establishes the space dimensions of the canvas to 2D

      // Re-route audio playback into the processing graph of the AudioContext
      source = context.createMediaElementSource(audio);
      source.connect(analyser); // lets you connect one of the node's outputs to a target: AudioNode or AudioParam

      analyser.connect(context.destination); // createAnalyser called on our audio context

      frameLooper();
    };

    const frameLooper = () => {
      window.requestAnimationFrame(frameLooper);
      fbc_array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(fbc_array); // FEEDING FREQUENCY DATA INTO THE ANALYSER

      ctx.clearRect(0, 0, canvas.width, canvas.height); // CLEARING THE CANVAS
      ctx.fillStyle = '#00CCFF'; // SETTING THE FILL OF THE CANVAS

      for (var i = 0; i < 100; i++) { // SCALED TO 100
        bar_x = i * 3;
        bar_width = 10;
        bar_height = -fbc_array[i] / 1.5;
        console.log(i);
      }

      ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    };

    return (
      <div>
        <div id="mp3_player">
          <div id="audio_box"></div>
          <canvas id="analyser_render"></canvas>
        </div>
        <button onClick={initPlayer}>Render</button>
        <button onClick={frameLooper}>Update</button>
        <button onClick={()=>{console.log(audio.duration / 60)}}>Duration</button>
      </div>
    );
}

export default App;