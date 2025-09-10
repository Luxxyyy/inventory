const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Source = require("./source_model");

const Balangay = sequelize.define(
  "Balangay",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    balangay: {
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
    tableName: "balangays",
    freezeTableName: true,
    timestamps: false,
  }
);

Balangay.belongsTo(Source, { foreignKey: "source_id" });
Source.hasMany(Balangay, { foreignKey: "source_id" });

module.exports = Balangay;
