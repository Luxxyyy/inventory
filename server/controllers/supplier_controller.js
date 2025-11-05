const Supplier = require("../models/supplier_model");
const { logAction } = require("../utils/logger");

// Get all suppliers
async function getAllSuppliers(req, res) {
  try {
    const suppliers = await Supplier.findAll({
      order: [["id", "ASC"]],
    });
    res.json(suppliers);
  } catch (err) {
    console.error("Supplier fetch error:", err);
    res.status(500).json({ error: "Database error" });
  }
}

// Create new supplier
async function createSupplier(req, res) {
  try {
    const { supplier_name, supplier_image } = req.body;

    if (!supplier_name)
      return res.status(400).json({ error: "Supplier name is required" });

    const newSupplier = await Supplier.create({
      supplier_name,
      supplier_image: supplier_image || null,
    });

    await logAction({
      action: "create",
      model: "Supplier",
      description: `Supplier '${supplier_name}' created`,
      userId: req.user.id,
    });

    res.status(201).json(newSupplier);
  } catch (err) {
    console.error("Supplier insert error:", err);
    res.status(500).json({ error: "Failed to insert supplier" });
  }
}

// Update supplier
async function updateSupplier(req, res) {
  try {
    const { id } = req.params;
    const { supplier_name, supplier_image } = req.body;

    if (!supplier_name)
      return res.status(400).json({ error: "Supplier name is required" });

    const existing = await Supplier.findByPk(id);
    if (!existing) return res.status(404).json({ error: "Supplier not found" });

    await existing.update({
      supplier_name,
      supplier_image: supplier_image || null,
    });

    await logAction({
      action: "update",
      model: "Supplier",
      description: `Supplier ID ${id} updated`,
      userId: req.user.id,
    });

    res.json({ message: "Supplier updated successfully", supplier: existing });
  } catch (err) {
    console.error("Supplier update error:", err);
    res.status(500).json({ error: "Failed to update supplier" });
  }
}

// Delete supplier
async function deleteSupplier(req, res) {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });

    await supplier.destroy();

    await logAction({
      action: "delete",
      model: "Supplier",
      description: `Supplier '${supplier.supplier_name}' deleted`,
      userId: req.user.id,
    });

    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    console.error("Supplier deletion error:", err);
    res.status(500).json({ error: "Failed to delete supplier" });
  }
}

module.exports = {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
