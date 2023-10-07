import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { GradientMaterial } from "./GradientMaterial";
import { color1IndexState, color2IndexState } from "../atoms";
import { useRecoilState } from "recoil";

extend({ GradientMaterial });

function Visualizer({ visualizerPalette, loudness, chromaIndex }) {
  const boxRef = useRef();
  const [color1Index, setColor1Index] = useRecoilState(color1IndexState);
  const [color2Index, setColor2Index] = useRecoilState(color2IndexState);

  const settings = {
    speed: 0.2,
    density: 1.5,
    strength: 0.3 + Math.sin(Math.PI * loudness),
    frequency: Math.sin(Math.PI * loudness),
    amplitude: Math.sin(Math.PI * loudness),
    intensity: 7.0,
  };

  const colorsArray = visualizerPalette.colors.split("+");

  const color_bins = { red: [], green: [], blue: [] };

  colorsArray.forEach((color) => {
    const red = Math.abs(new THREE.Color(color).r - 255);
    const green = Math.abs(new THREE.Color(color).g - 255);
    const blue = Math.abs(new THREE.Color(color).b - 255);
    const min = Math.min(red, green, blue);

    if (min === red) {
      color_bins["red"].push(color);
    } else if (min === green) {
      color_bins["green"].push(color);
    } else if (min === blue) {
      color_bins["blue"].push(color);
    }
  });

  //console.log(color_bins);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  useFrame(({ clock }) => {
    boxRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    boxRef.current.material.uniforms.uSpeed.value = settings.speed;
    boxRef.current.material.uniforms.uNoiseDensity.value = settings.density;
    boxRef.current.material.uniforms.uNoiseStrength.value = settings.strength;
  }, []);

  useEffect(() => {
    if (chromaIndex > 8) {
      console.log("high note");
      const numRedBinColors = color_bins["red"].length;

      if (color_bins["red"].length !== 0) {
        const randomRed = color_bins["red"][getRandomInt(0, numRedBinColors)];
        const index = colorsArray.findIndex((color) => color === randomRed);
        setColor1Index(index);
      }
    } else if (chromaIndex <= 8 && chromaIndex > 4) {
      const numGreenBinColors = color_bins["green"].length;

      if (color_bins["green"].length !== 0) {
        const randomGreen =
          color_bins["green"][getRandomInt(0, numGreenBinColors)];
        const index = colorsArray.findIndex((color) => color === randomGreen);
        setColor1Index(index);
      }
    } else {
      console.log("lower note");
      const numBlueBinColors = color_bins["blue"].length;

      if (color_bins["blue"].length !== 0) {
        const randomBlue =
          color_bins["blue"][getRandomInt(0, numBlueBinColors)];
        const index = colorsArray.findIndex((color) => color === randomBlue);
        setColor2Index(index);
      }
    }
  }, [chromaIndex]);

  return (
    <mesh ref={boxRef}>
      <icosahedronGeometry args={[1.75, 64]} />
      <gradientMaterial
        key={GradientMaterial.key}
        uTime={0}
        uSpeed={settings.speed}
        uNoiseDensity={settings.density}
        uNoiseStrength={settings.strength}
        uFrequency={settings.frequency}
        uAmplitude={settings.amplitude}
        uIntensity={settings.intensity}
        color1={new THREE.Color(colorsArray[color1Index])}
        color2={new THREE.Color(colorsArray[color2Index])}
      />
    </mesh>
  );
}

export default Visualizer;
