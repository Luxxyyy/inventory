const { titleColorMap, sizeColorMap } = require("./colorMaps");

const getColorByTitleOrSize = (title, size) => {
  if (title) {
    const titleKey = Object.keys(titleColorMap).find(
      (key) => title.toLowerCase() === key.toLowerCase()
    );
    if (titleKey) {
      const color = titleColorMap[titleKey];
      if (color) return color;
    }
  }
  if (size) {
    const sizeKey = Object.keys(sizeColorMap).find(
      (key) => size.toLowerCase() === key.toLowerCase()
    );
    if (sizeKey) {
      return sizeColorMap[sizeKey];
    }
  }

  return "";
};

const titleOptions = Object.keys(titleColorMap);
const sizeOptions = Object.keys(sizeColorMap);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

module.exports = {
  getColorByTitleOrSize,
  titleOptions,
  sizeOptions,
  capitalize,
};
