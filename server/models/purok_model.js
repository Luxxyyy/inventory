const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Balangay = require("./balangay_model");
const Source = require("./source_model");

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

Purok.belongsTo(Balangay, { foreignKey: "balangay_id" });
Purok.belongsTo(Source, { foreignKey: "source_id" });

module.exports = Purok;
