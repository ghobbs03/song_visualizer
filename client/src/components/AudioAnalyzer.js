import React from "react";
import * as Meyda from "meyda";
import { useRef, useEffect } from "react";
import { Canvas } from '@react-three/fiber';
import Visualizer from "./Visualizer";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { loudnessState, analyzerState, contextState } from "../atoms"; 



function AudioAnalyzer({ url, visualizerPalette }) {
    const [loudness, setLoudness] = useState(0);
    const [chroma, setChroma] = useState(0);
    const [analyzer, setAnalyzer] = useState();
    const audioRef = useRef(null);
    const [context, setContext] = useState();
    let audioContext;
    let source;

    function createAnalyzer() {
        audioContext = (audioContext !== undefined) ? audioContext : new AudioContext();
        setContext(audioContext)
        const htmlAudioElement = audioRef.current;
        source = (source !== undefined) ? source : audioContext.createMediaElementSource(htmlAudioElement);
        source.connect(audioContext.destination);

        if (typeof Meyda !== "undefined") {
            let lastFeatures;

            const sound_analyzer = Meyda.createMeydaAnalyzer({
                audioContext: audioContext,
                source: source,
                bufferSize: 2048,
                featureExtractors: ["loudness", "chroma"],
                callback: (features) => {
                    //console.log(features);
                    lastFeatures = features;
                    console.log(features.chroma)
                    handleLoudness(features.loudness.specific);
                }
            });
            
            sound_analyzer.start();

            setAnalyzer(sound_analyzer);

        }
    }

    function handleChroma(chroma_arr) {

        const sum = chroma_arr.reduce((a, b) => a + b, 0);
        const avgChroma = (sum / chroma_arr.length) || 0;

        /*if (Math.abs(avgChroma - chroma[chroma.length - 1]) > last_dist) {
            setChroma([...avgChroma])

        }*/

        setChroma([...chroma, avgChroma])

        
    }


    function handleAnalyzer() {
        analyzer.start();
    }

    function handleLoudness(loudness_specific) {
        loudness_specific.forEach((loudness_lvl) => {
            setLoudness(loudness_lvl)

        })

    }

    function checkAudioContext() {
        if (context) {
            handleAnalyzer();

        } else {
            createAnalyzer();
        }
    }


    return <div>
        <audio className="entries_audio" ref={audioRef} crossOrigin={"anonymous"} onPlay={() => checkAudioContext()} src={url} controls />
        <Canvas style={{ height: "230px", borderRadius: "20px" }}>
            <Visualizer visualizerPalette={visualizerPalette} loudness={loudness} />
        </Canvas>
        </div>;
}

        export default AudioAnalyzer;