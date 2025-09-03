import { titleColorMap, sizeColorMap } from "./colorMaps";
import { capitalize } from "./legendHelpers";

export const legendItems = [
  ...Object.entries(sizeColorMap)
    .filter(([_, color]) => color)
    .map(([size, color]) => ({
      label: `${size} (${capitalize(color)} Line)`,
      type: "line",
      color,
      cssClass: `${color}-line`,
    })),

  ...Object.entries(titleColorMap)
    .filter(([_, color]) => color)
    .map(([title, color]) => ({
      label: `${title} (${capitalize(color)} Dot)`,
      type: "dot",
      color,
      cssClass: `${color}-dot`,
    })),
];
