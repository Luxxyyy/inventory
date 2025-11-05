const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Supplier = sequelize.define(
  "Supplier",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    supplier_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supplier_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_added: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "suppliers",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Supplier;
