import { titleColorMap, sizeColorMap } from "./colorMaps";

export const getColorByTitleOrSize = (title: string, size: string): string => {
  const titleKey = Object.keys(titleColorMap).find(
    (key) => title.toLowerCase() === key.toLowerCase()
  );
  if (titleKey) {
    const color = titleColorMap[titleKey];
    if (color) return color;
  }

  const sizeKey = Object.keys(sizeColorMap).find(
    (key) => size.toLowerCase() === key.toLowerCase()
  );
  if (sizeKey) return sizeColorMap[sizeKey];

  return "";
};

export const titleOptions = Object.keys(titleColorMap);
export const sizeOptions = Object.keys(sizeColorMap);

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
