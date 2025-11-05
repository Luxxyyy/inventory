const Category = require("../models/category_model");
const { logAction } = require("../utils/logger");

// Get all categories
async function getAllCategories(req, res) {
  try {
    const categories = await Category.findAll({ order: [["id", "ASC"]] });
    res.json(categories);
  } catch (error) {
    console.error("Category fetch error:", error);
    res.status(500).json({ error: "Database error" });
  }
}

// Create category
async function createCategory(req, res) {
  try {
    const { category_name } = req.body;

    if (!category_name)
      return res.status(400).json({ error: "Category name is required" });

    const newCategory = await Category.create({ category_name });

    await logAction({
      action: "create",
      model: "Category",
      description: `Category '${category_name}' created`,
      userId: req.user.id,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Category insert error:", error);
    res.status(500).json({ error: "Failed to insert category" });
  }
}

// Update category
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name)
      return res.status(400).json({ error: "Category name is required" });

    const existing = await Category.findByPk(id);
    if (!existing) return res.status(404).json({ error: "Category not found" });

    await existing.update({ category_name });

    await logAction({
      action: "update",
      model: "Category",
      description: `Category ID ${id} updated`,
      userId: req.user.id,
    });

    res.json({ message: "Category updated successfully", category: existing });
  } catch (error) {
    console.error("Category update error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
}

// Delete category
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    await category.destroy();

    await logAction({
      action: "delete",
      model: "Category",
      description: `Category '${category.category_name}' deleted`,
      userId: req.user.id,
    });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Category deletion error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
