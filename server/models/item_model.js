const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Category = require("./category_model");

const Item = sequelize.define(
  "Item",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    item_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    date_added: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "items",
    freezeTableName: true,
    timestamps: false,
  }
);

Item.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Item, { foreignKey: "category_id" });

module.exports = Item;
