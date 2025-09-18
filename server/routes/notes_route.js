const express = require("express");
const router = express.Router();
const Note = require("../models/note_model");
const User = require("../models/user_model");
const { attachUser } = require("../middleware/auth_middleware");

router.post("/", attachUser, async (req, res) => {
  try {
    const { title, message, latitude, longitude, image, fullImage, isDone } =
      req.body;
    const userId = req.user.id;

    const newNote = await Note.create({
      title,
      message,
      latitude,
      longitude,
      image,
      full_image: fullImage,
      isDone: isDone || false,
      user_id: userId,
    });

    const populatedNote = await Note.findByPk(newNote.id, {
      include: ["User"],
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("new_note", populatedNote);
    }

    res.status(201).json(populatedNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note." });
  }
});

router.get("/", async (req, res) => {
  try {
    const notes = await Note.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username", "role"],
        },
      ],
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes." });
  }
});

router.put("/:id", attachUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { isDone, title, message, image, fullImage } = req.body;

    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    if (note.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    note.title = title !== undefined ? title : note.title;
    note.message = message !== undefined ? message : note.message;
    note.isDone = isDone !== undefined ? isDone : note.isDone;
    note.image = image !== undefined ? image : note.image;
    note.full_image = fullImage !== undefined ? fullImage : note.full_image;

    await note.save();

    const populatedNote = await Note.findByPk(note.id, {
      include: ["User"],
    });

    res.status(200).json(populatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note." });
  }
});

router.delete("/:id", attachUser, async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    if (note.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await note.destroy();

    res.status(204).send("Note deleted successfully.");
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note." });
  }
});

module.exports = router;
