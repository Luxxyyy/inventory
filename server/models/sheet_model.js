// sheet_model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Source = require("./source_model");

const Sheet = sequelize.define(
  "Sheet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sheet_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Source,
        key: "id",
      },
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
    tableName: "sheets",
    freezeTableName: true,
    timestamps: false,
  }
);

// Set up association
Sheet.belongsTo(Source, { foreignKey: "source_id" });
Source.hasMany(Sheet, { foreignKey: "source_id" });

module.exports = Sheet;
