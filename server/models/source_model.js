const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Source = sequelize.define(
  "Source",
  {
    balangay: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "sources",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Source;
