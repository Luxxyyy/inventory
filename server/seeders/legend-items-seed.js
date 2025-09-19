"use strict";
const { titleColorMap, sizeColorMap } = require("../utils/colorMaps");
const { capitalize } = require("../utils/legendHelper");

const lineItems = Object.entries(sizeColorMap)
  .filter(([_, color]) => color)
  .map(([size, color]) => ({
    label: `${size} (${capitalize(color)} Line)`,
    type: "line",
    color,
    cssClass: `${color}-line`,
  }));

const dotItems = Object.entries(titleColorMap)
  .filter(([_, color]) => color)
  .map(([title, color]) => ({
    label: `${title} (${capitalize(color)} Dot)`,
    type: "dot",
    color,
    cssClass: `${color}-dot`,
  }));

const legendItems = [...lineItems, ...dotItems];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("legend_items", legendItems, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("legend_items", null, {});
  },
};
