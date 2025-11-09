const { logAction } = require("../utils/logger");
const Inventory = require("../models/inventory_model");
const Item = require("../models/item_model");
const Supplier = require("../models/supplier_model");
const Category = require("../models/category_model");

async function getAllInventory(req, res) {
  try {
    const inventory = await Inventory.findAll({
      include: [
        { model: Item, attributes: ["id", "item_name"] },
        { model: Supplier, attributes: ["id", "supplier_name"] },
        { model: Category, attributes: ["id", "category_name"] },
      ],
      order: [["id", "ASC"]],
    });

    const response = inventory.map((inv) => ({
      id: inv.id,
      item_id: inv.item_id,
      supplier_id: inv.supplier_id,
      category_id: inv.category_id,
      item_name: inv.Item?.item_name || null,
      supplier_name: inv.Supplier?.supplier_name || null,
      category_name: inv.Category?.category_name || null,
      quantity: inv.quantity,
      price: inv.price,
      amount: inv.quantity * inv.price,
      date_added: inv.date_added,
    }));

    res.json(response);
  } catch (error) {
    console.error("Inventory fetch error:", error);
    res.status(500).json({ error: "Database error" });
  }
}

async function createInventory(req, res) {
  try {
    let { item_id, supplier_id, category_id, quantity, price } = req.body;

    item_id = Number(item_id);
    supplier_id = Number(supplier_id);
    category_id = Number(category_id);
    quantity = Number(quantity);
    price = Number(price);

    if (
      !item_id ||
      !supplier_id ||
      !category_id ||
      isNaN(quantity) ||
      isNaN(price)
    ) {
      console.error("Invalid data:", req.body);
      return res.status(400).json({ error: "All fields are required" });
    }

    const amount = quantity * price;

    const newRecord = await Inventory.create({
      item_id,
      supplier_id,
      category_id,
      quantity,
      price,
      amount,
      date_added: new Date(),
    });

    await logAction({
      action: "create",
      model: "Inventory",
      description: `Inventory for ItemID ${item_id} created`,
      userId: req.user?.id || null,
    });

    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Inventory insert error:", error);
    res.status(500).json({ error: "Failed to insert inventory record" });
  }
}

async function updateInventory(req, res) {
  try {
    const { id } = req.params;
    let { item_id, supplier_id, category_id, quantity, price } = req.body;

    item_id = Number(item_id);
    supplier_id = Number(supplier_id);
    category_id = Number(category_id);
    quantity = Number(quantity);
    price = Number(price);

    if (
      !item_id ||
      !supplier_id ||
      !category_id ||
      isNaN(quantity) ||
      isNaN(price)
    ) {
      console.error("Invalid update data:", req.body);
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await Inventory.findByPk(id);
    if (!existing)
      return res.status(404).json({ error: "Inventory record not found" });

    const updatedQuantity = existing.quantity + quantity;
    const amount = updatedQuantity * price;

    await existing.update({
      item_id,
      supplier_id,
      category_id,
      quantity: updatedQuantity,
      price,
      amount,
      date_added: new Date(),
    });

    await logAction({
      action: "update",
      model: "Inventory",
      description: `Inventory ID ${id} updated`,
      userId: req.user?.id || null,
    });

    res.json({ message: "Inventory updated successfully", item: existing });
  } catch (error) {
    console.error("Inventory update error:", error);
    res.status(500).json({ error: "Failed to update inventory" });
  }
}

async function deleteInventory(req, res) {
  try {
    const { id } = req.params;
    const record = await Inventory.findByPk(id);
    if (!record) return res.status(404).json({ error: "Inventory not found" });

    await record.destroy();

    await logAction({
      action: "delete",
      model: "Inventory",
      description: `Inventory ID ${id} deleted`,
      userId: req.user?.id || null,
    });

    res.json({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error("Inventory deletion error:", error);
    res.status(500).json({ error: "Failed to delete inventory" });
  }
}

module.exports = {
  getAllInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
