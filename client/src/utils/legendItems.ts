import { titleColorMap, sizeColorMap } from "./colorMaps";
import { capitalize } from "./legendHelpers";

const lineItems = Object.entries(sizeColorMap)
  .filter(([_, color]) => color)
  .map(([size, color]) => ({
    label: `${size} (${capitalize(color)} Line)`,
    type: "line",
    color,
    cssClass: `${color}-line`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const dotItems = Object.entries(titleColorMap)
  .filter(([_, color]) => color)
  .map(([title, color]) => ({
    label: `${title} (${capitalize(color)} Dot)`,
    type: "dot",
    color,
    cssClass: `${color}-dot`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const legendItems = [
  ...lineItems,
  ...dotItems,
];
