import { atom } from "recoil";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export const color1IndexState = atom({
  key: "color1IndexState",
  default: getRandomInt(0, 2),
});

export const color2IndexState = atom({
  key: "color2IndexState",
  default: getRandomInt(3, 5),
});

export const userState = atom({
  key: "userState",
  default: undefined,
});

export const loudnessState = atom({
  key: "loudnessState",
  default: 0,
});

export const analyzerState = atom({
  key: "analyzerState",
  default: undefined,
});

export const contextState = atom({
  key: "contextState",
  default: undefined,
});
