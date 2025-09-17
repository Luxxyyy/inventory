// server/routes/notes_route.js
const express = require("express");
const router = express.Router();
const Note = require("../models/note_model");
const { attachUser } = require("../middleware/auth_middleware"); // <-- CORRECTED PATH

// Create a new note
router.post("/", attachUser, async (req, res) => {
  try {
    const { title, message, latitude, longitude, image, isDone } = req.body;
    const userId = req.user.id;

    const newNote = await Note.create({
      title,
      message,
      latitude,
      longitude,
      image,
      isDone: isDone || false,
      user_id: userId,
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note." });
  }
});

// Get all notes, filtered by 'isDone' status
router.get("/", async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { isDone: false },
      include: ["User"], // Assuming a Note.belongsTo(User) association
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes." });
  }
});

// Update a note (e.g., mark as done)
router.put("/:id", attachUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { isDone, title, message } = req.body;

    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    note.title = title || note.title;
    note.message = message || note.message;
    note.isDone = isDone !== undefined ? isDone : note.isDone;

    await note.save();

    res.status(200).json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note." });
  }
});

// Delete a note
router.delete("/:id", attachUser, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Note.destroy({ where: { id } });

    if (deleted) {
      res.status(204).send("Note deleted successfully.");
    } else {
      res.status(404).json({ error: "Note not found." });
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note." });
  }
});

module.exports = router;
