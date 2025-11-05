const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Item = require("./item_model");
const Supplier = require("./supplier_model");
const Category = require("./category_model");

const Inventory = sequelize.define(
  "Inventory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "item", key: "id" },
      onDelete: "CASCADE",
    },
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "supplier", key: "id" },
      onDelete: "CASCADE",
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "category", key: "id" },
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue("quantity") * this.getDataValue("price");
      },
    },
    date_added: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "inventory",
    freezeTableName: true,
    timestamps: false,
  }
);

Inventory.belongsTo(Item, { foreignKey: "item_id" });
Inventory.belongsTo(Supplier, { foreignKey: "supplier_id" });
Inventory.belongsTo(Category, { foreignKey: "category_id" });

module.exports = Inventory;
