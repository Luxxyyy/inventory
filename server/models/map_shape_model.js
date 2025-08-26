const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const MapShape = sequelize.define(
  "MapShape",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
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
