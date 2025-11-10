const Sale = require("../models/sales_model");
const Inventory = require("../models/inventory_model");
const Item = require("../models/item_model");
const { logAction } = require("../utils/logger");

async function createSale(req, res) {
    try {
        let { inventory_id, quantity_sold, selling_price, date_sold } = req.body;

        inventory_id = Number(inventory_id);
        quantity_sold = Number(quantity_sold);
        selling_price = Number(selling_price);

        if (!inventory_id || quantity_sold <= 0 || selling_price <= 0) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const inventory = await Inventory.findByPk(inventory_id);
        if (!inventory)
            return res.status(404).json({ error: "Inventory not found" });
        if (inventory.quantity < quantity_sold)
            return res.status(400).json({ error: "Not enough stock" });

        // Deduct sold quantity
        inventory.quantity -= quantity_sold;
        await inventory.save();

        const profit = (selling_price - inventory.price) * quantity_sold;

        const sale = await Sale.create({
            inventory_id,
            item_id: inventory.item_id,
            quantity_sold,
            selling_price,
            profit,
            date_sold: date_sold ? new Date(date_sold) : new Date(),
        });

        await logAction({
            action: "create",
            model: "Sale",
            description: `Sold ${quantity_sold} of Inventory ID ${inventory_id}`,
            userId: req.user?.id || null,
        });

        res.status(201).json(sale);
    } catch (error) {
        console.error("🔥 Sale creation error:", error);
        res.status(500).json({ error: "Failed to create sale", details: error.message });
    }
}

async function getSales(req, res) {
    try {
        const sales = await Sale.findAll({
            include: [
                {
                    model: Inventory,
                    attributes: ["id", "item_id", "price"],
                    include: [
                        {
                            model: Item,
                            attributes: ["item_name"],
                        },
                    ],
                },
            ],
            order: [["date_sold", "ASC"]],
        });

        const response = sales.map((s) => ({
            id: s.id,
            item_id: s.item_id,
            item_name: s.Inventory?.Item?.item_name || "Unknown Item",
            quantity_sold: s.quantity_sold,
            selling_price: s.selling_price,
            profit: s.profit,
            date_sold: s.date_sold,
        }));

        res.json(response);
    } catch (error) {
        console.error("🔥 Fetch sales error:", error);
        res.status(500).json({ error: "Failed to fetch sales", details: error.message });
    }
}

module.exports = { createSale, getSales };
