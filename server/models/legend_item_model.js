const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const LegendItem = sequelize.define(
  "LegendItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("line", "dot"),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: "#ffffff",
      allowNull: true,
    },
    cssClass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "legend_items",
    timestamps: false,
  }
);

module.exports = LegendItem;
