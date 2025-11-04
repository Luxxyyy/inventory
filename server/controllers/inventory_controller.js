const { logAction } = require("../utils/logger");
const Inventory = require("../models/inventory_model");

async function getAllInventory(req, res) {
  try {
    const items = await Inventory.findAll({ order: [["id", "ASC"]] });
    res.json(items);
  } catch (error) {
    console.error("Inventory fetch error:", error);
    res.status(500).json({ error: "Database error" });
  }
}

async function createInventory(req, res) {
  try {
    const { item_name, supplier, quantity, price } = req.body;

    if (!item_name || !supplier || quantity == null || price == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Remove amount: let MySQL compute it
    const newItem = await Inventory.create({
      item_name,
      supplier,
      quantity,
      price,
    });

    await logAction({
      action: "create",
      model: "Inventory",
      description: `Item '${item_name}' created`,
      userId: req.user.id,
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Inventory insert error:", error);
    res.status(500).json({ error: "Failed to insert item" });
  }
}

async function updateInventory(req, res) {
  try {
    const { id } = req.params;
    const { item_name, supplier, quantity, price } = req.body;

    if (!item_name || !supplier || quantity == null || price == null) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingItem = await Inventory.findByPk(id);
    if (!existingItem) return res.status(404).json({ error: "Item not found" });

    // Remove amount: let MySQL compute it
    await existingItem.update({ item_name, supplier, quantity, price });

    await logAction({
      action: "update",
      model: "Inventory",
      description: `Item ID ${id} updated`,
      userId: req.user.id,
    });

    res.json({ message: "Item updated successfully", item: existingItem });
  } catch (error) {
    console.error("Inventory update error:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
}

async function deleteInventory(req, res) {
  try {
    const { id } = req.params;
    const item = await Inventory.findByPk(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    await item.destroy();

    await logAction({
      action: "delete",
      model: "Inventory",
      description: `Item '${item.item_name}' deleted`,
      userId: req.user.id,
    });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Inventory deletion error:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
}

module.exports = {
  getAllInventory,
  createInventory,
  updateInventory,
  deleteInventory,
};
