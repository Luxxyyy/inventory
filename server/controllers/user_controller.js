const { logAction } = require("../utils/logger");
const User = require("../models/user_model");
const bcrypt = require("bcrypt");

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role", "image", "full_image"],
      order: [["id", "ASC"]],
    });
    res.json(users);
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ error: "Database error" });
  }
}

async function createUser(req, res) {
  try {
    const { username, email, password, role, image, full_image } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({
      where: {
        username,
        email,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      image: image || null,
      full_image: full_image || null,
    });

    await logAction({
      action: "create",
      model: "User",
      description: `User '${username}' created`,
      userId: req.user?.id || null,
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, email, password, role, image, full_image } = req.body;

    if (!username || !email || !role) {
      return res
        .status(400)
        .json({ error: "Username, email, and role are required" });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updateData = { username, email, role };

    if (password && password.trim().length > 0) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (typeof image !== "undefined") updateData.image = image;
    if (typeof full_image !== "undefined") updateData.full_image = full_image;

    await user.update(updateData);

    await logAction({
      action: "update",
      model: "User",
      description: `User ID ${id} updated`,
      userId: req.user?.id || null,
    });

    const responseUser = user.toJSON();
    delete responseUser.password;

    res.json({ message: "User updated successfully", user: responseUser });
  } catch (error) {
    console.error("User update error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();

    await logAction({
      action: "delete",
      model: "User",
      description: `User '${user.username}' deleted`,
      userId: req.user?.id || null,
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User deletion error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
}

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
