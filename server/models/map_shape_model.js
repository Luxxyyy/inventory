const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const MapShape = sequelize.define(
  "MapShape",
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    geojson: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    radius: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "map_shapes",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = MapShape;
