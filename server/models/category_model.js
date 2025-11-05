const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_added: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "categories",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Category;
