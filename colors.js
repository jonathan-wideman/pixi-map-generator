import { tailwindColors } from "./tailwindColors";

export const colorToHex = (color) => parseInt(color.replace(/^#/, ""), 16);

export const randomHexColor = () => {
  const hues = Object.keys(tailwindColors);
  const hue = tailwindColors[hues[randomInt(0, hues.length - 1)]];
  const saturations = Object.keys(hue);
  const color = hue[saturations[randomInt(0, saturations.length - 1)]];
  return colorToHex(color);
};

export const randomHexShade = (hue) => {
  const shades = Object.keys(hue);
  const color = hue[shades[randomInt(0, shades.length - 1)]];
  return colorToHex(color);
};

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const cellShades = [
  colorToHex(tailwindColors.emerald[100]),
  colorToHex(tailwindColors.emerald[200]),
  colorToHex(tailwindColors.emerald[300]),
  colorToHex(tailwindColors.emerald[400]),
  colorToHex(tailwindColors.emerald[500]),
  colorToHex(tailwindColors.emerald[600]),
  colorToHex(tailwindColors.emerald[700]),
  colorToHex(tailwindColors.emerald[800]),
  colorToHex(tailwindColors.emerald[900]),
  colorToHex(tailwindColors.amber[100]),
  colorToHex(tailwindColors.blue[500]),
  colorToHex(tailwindColors.blue[700]),
  colorToHex(tailwindColors.blue[900]),
  colorToHex(tailwindColors.blue[900]),
  colorToHex(tailwindColors.blue[900]),
  colorToHex(tailwindColors.blue[900]),
];

export const getCellShade = (value) => {
  // convert the value (a number between -1 and 1) to a cellShade
  const index = Math.floor(((cellShades.length - 1) * (value + 1)) / 2);
  return cellShades[index];
};

export const randomCellShade = () => {
  return cellShades[randomInt(0, cellShades.length - 1)];
};

export const bgColor = colorToHex(tailwindColors.stone[900]);
export const pointColor = colorToHex(tailwindColors.orange[500]);
export const traingleEdgeColor = colorToHex(tailwindColors.stone[800]);
export const voronoiEdgeColor = colorToHex(tailwindColors.stone[700]);
