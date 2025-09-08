import { titleColorMap, sizeColorMap } from "./colorMaps";

// ✅ Safe version of color resolver
export const getColorByTitleOrSize = (
  title?: string,
  size?: string
): string => {
  // Check for valid title and resolve color
  if (title) {
    const titleKey = Object.keys(titleColorMap).find(
      (key) => title.toLowerCase() === key.toLowerCase()
    );
    if (titleKey) {
      const color = titleColorMap[titleKey];
      if (color) return color;
    }
  }

  // If no title color, try size
  if (size) {
    const sizeKey = Object.keys(sizeColorMap).find(
      (key) => size.toLowerCase() === key.toLowerCase()
    );
    if (sizeKey) {
      return sizeColorMap[sizeKey];
    }
  }

  return ""; // Fallback: no color found
};

// Export options for dropdowns
export const titleOptions = Object.keys(titleColorMap);
export const sizeOptions = Object.keys(sizeColorMap);

// Utility to capitalize strings
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
