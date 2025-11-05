const Item = require("../models/item_model");
const Category = require("../models/category_model");
const { logAction } = require("../utils/logger");

// Get all items
async function getAllItems(req, res) {
  try {
    const items = await Item.findAll({
      include: [{ model: Category, attributes: ["id", "category_name"] }],
      order: [["id", "ASC"]],
    });

    const response = items.map((i) => ({
      id: i.id,
      item_name: i.item_name,
      barcode: i.barcode,
      item_image: i.item_image,
      date_added: i.date_added,
      category_id: i.category_id,
      category_name: i.Category?.category_name || null,
    }));

    res.json(response);
  } catch (err) {
    console.error("Item fetch error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

// Create new item
async function createItem(req, res) {
  try {
    const { item_name, barcode, item_image, category_id } = req.body;

    if (!item_name || !category_id)
      return res
        .status(400)
        .json({ error: "Item name and category are required" });

    const category = await Category.findByPk(category_id);
    if (!category)
      return res.status(400).json({ error: "Invalid category_id" });

    const newItem = await Item.create({
      item_name,
      barcode: barcode || null,
      item_image: item_image || null,
      category_id,
    });

    await logAction({
      action: "create",
      model: "Item",
      description: `Item '${item_name}' created`,
      userId: req.user.id,
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Item insert error:", err);
    res.status(500).json({ error: "Failed to insert item" });
  }
}

// Update item
async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { item_name, barcode, item_image, category_id } = req.body;

    if (!item_name || !category_id)
      return res
        .status(400)
        .json({ error: "Item name and category are required" });

    const existing = await Item.findByPk(id);
    if (!existing) return res.status(404).json({ error: "Item not found" });

    const category = await Category.findByPk(category_id);
    if (!category)
      return res.status(400).json({ error: "Invalid category_id" });

    await existing.update({
      item_name,
      barcode: barcode || null,
      item_image: item_image || null,
      category_id,
    });

    await logAction({
      action: "update",
      model: "Item",
      description: `Item ID ${id} updated`,
      userId: req.user.id,
    });

    res.json({ message: "Item updated successfully", item: existing });
  } catch (err) {
    console.error("Item update error:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
}

// Delete item
async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    await item.destroy();

    await logAction({
      action: "delete",
      model: "Item",
      description: `Item '${item.item_name}' deleted`,
      userId: req.user.id,
    });

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Item deletion error:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
}

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
};
