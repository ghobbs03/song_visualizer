import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { extend } from '@react-three/fiber';
import * as THREE from "three";
import { GradientMaterial } from './GradientMaterial';
import { color1IndexState, color2IndexState } from '../atoms';
import { useRecoilState } from 'recoil';

extend({ GradientMaterial })

function Visualizer({ visualizerPalette , loudness}) {
  const boxRef = useRef();
  const [color1Index, setColor1Index] = useRecoilState(color1IndexState);
  const [color2Index, setColor2Index] = useRecoilState(color2IndexState);

  const settings = {
    speed: 0.2,
    density: 1.5,
    strength: 0.3 + loudness,
    frequency: 3.0,
    amplitude: 6.0 - loudness,
    intensity: 7.0,
  };

  const colorsArray = visualizerPalette.colors.split('+');

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  useFrame(({ clock }) => {

    boxRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
    boxRef.current.material.uniforms.uSpeed.value = settings.speed;
    boxRef.current.material.uniforms.uNoiseDensity.value = settings.density;
    boxRef.current.material.uniforms.uNoiseStrength.value = settings.strength;

  }, []);

  const FIVE_S = 15000;
  const TEN_S = 10000;

  useEffect(() => {
    const interval = setInterval(() => {
      setColor1Index(getRandomInt(0, 2))
  
    }, FIVE_S);

    return () => clearInterval(interval);

    //return () => {clearInterval(interval); clearInterval(interval2)}; // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])


  useEffect(() => {
    const interval = setInterval(() => {
      setColor2Index(getRandomInt(3, 5))

      }, TEN_S)

      return () => clearInterval(interval);
    }, [])

  return (<mesh ref={boxRef}/*  rotation-y={Math.PI * 0.25} rotation-x={Math.PI * 0.25} */ /*scale={ [1 + (loudness * 0.75), 1 + ( (loudness * 0.75)), 1] }*/ >
    <icosahedronGeometry args={[1.75, 64]} />
    <gradientMaterial key={GradientMaterial.key} 
      uTime= {0} 
      uSpeed={settings.speed} 
      uNoiseDensity={settings.density} 
      uNoiseStrength={ settings.strength}
      uFrequency={settings.frequency}
      uAmplitude={settings.amplitude}
      uIntensity={settings.intensity}
      color1={new THREE.Color(colorsArray[color1Index])}
      color2={new THREE.Color(colorsArray[color2Index])}
       />
  </mesh>
  )
}

export default Visualizer;