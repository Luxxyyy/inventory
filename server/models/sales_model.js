const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Inventory = require("./inventory_model");

const Sale = sequelize.define(
    "Sale",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },

        inventory_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "inventory",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        item_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: "inventory",
                key: "item_id",
            },
        },

        quantity_sold: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        selling_price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        profit: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        date_sold: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "sales",
        freezeTableName: true,
        timestamps: false,
    }
);

Sale.belongsTo(Inventory, { foreignKey: "inventory_id" });

module.exports = Sale;
