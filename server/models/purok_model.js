const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Purok = sequelize.define(
  "Purok",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    purok: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
    date_added: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "puroks",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Purok;
