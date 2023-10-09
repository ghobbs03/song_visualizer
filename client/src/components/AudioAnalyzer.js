import React from "react";
import * as Meyda from "meyda";
import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Visualizer from "./Visualizer";
import { useState } from "react";

function AudioAnalyzer({ url, visualizerPalette }) {
  const [loudness, setLoudness] = useState(0);
  const [chromaIndex, setChromaIndex] = useState(0);
  const [analyzer, setAnalyzer] = useState();
  const audioRef = useRef(null);
  const [context, setContext] = useState();
  let audioContext;
  let source;

  function createAnalyzer() {
    audioContext =
      audioContext !== undefined ? audioContext : new AudioContext();
    setContext(audioContext);
    const htmlAudioElement = audioRef.current;
    source =
      source !== undefined
        ? source
        : audioContext.createMediaElementSource(htmlAudioElement);
    source.connect(audioContext.destination);

    if (typeof Meyda !== "undefined") {
      const sound_analyzer = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: 2048,
        featureExtractors: ["loudness", "chroma"],
        callback: (features) => {
          //console.log(features.chroma);

          handleChroma(features.chroma);
          handleLoudness(features.loudness.specific);
        },
      });

      sound_analyzer.start();

      setAnalyzer(sound_analyzer);
    }
  }

  function handleChroma(chroma_arr) {
    if (chroma_arr[0] !== 0) {
      const maxIndex = chroma_arr.indexOf(Math.max(...chroma_arr));
      setChromaIndex(maxIndex);
    }
  }

  function handleAnalyzer() {
    analyzer.start();
  }

  function handleLoudness(loudness_specific) {
    loudness_specific.forEach((loudness_lvl) => {
      setLoudness(loudness_lvl);
    });
  }

  function checkAudioContext() {
    if (context) {
      handleAnalyzer();
    } else {
      createAnalyzer();
    }
  }

  return (
    <div>
      <audio
        className="entries_audio"
        ref={audioRef}
        crossOrigin={"anonymous"}
        type="audio/mp3"
        onPlay={() => checkAudioContext()}
        onClick={() => checkAudioContext()}
        src={url.substring(0, url.length - 4) + "mp3"}
        controls
      />
      <Canvas style={{ height: "230px", borderRadius: "20px" }}>
        <Visualizer
          visualizerPalette={visualizerPalette}
          loudness={loudness}
          chromaIndex={chromaIndex}
        />
      </Canvas>
    </div>
  );
}

export default AudioAnalyzer;
